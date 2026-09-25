import type { CefrLevel, DictionaryEntry } from '@/types/words'
import { hostOf } from './url'

// Чистая логика словаря: без браузерных API, чтобы тестировать в node.

/** Ключ словаря в `storage.local`: его знают и `useDictionary`, и резервная копия */
export const DICTIONARY_KEY = 'DICTIONARY'

export type DictionarySort = 'newest' | 'oldest' | 'alphabetical'

/** 'none' — записи без уровня: словарь его не даёт, проставляет только модель */
export type LevelFilter = CefrLevel | 'none'

export type DictionaryFilters = {
  search: string
  level: LevelFilter | null
  host: string | null
  onlyWithExplanation: boolean
}

export const EMPTY_FILTERS: DictionaryFilters = {
  search: '',
  level: null,
  host: null,
  onlyWithExplanation: false,
}

/** Источник записи: адрес страницы без query и хэша, заголовок обрезан */
export type WordSource = Pick<DictionaryEntry, 'sourceUrl' | 'sourceTitle'>

const TITLE_LIMIT = 120

/**
 * Адрес чистим от query и хэша: важна страница, а не то, как на неё пришли, —
 * иначе один и тот же пост считался бы разными источниками.
 */
export function pageSource(url: string, title: string): WordSource {
  try {
    const { origin, pathname } = new URL(url)

    return { sourceUrl: origin + pathname, sourceTitle: title.trim().slice(0, TITLE_LIMIT) || undefined }
  } catch {
    return {}
  }
}

/** Пусто — источника нет или адрес не разбирается */
export function sourceHost(entry: DictionaryEntry): string {
  return hostOf(entry.sourceUrl)
}

/** Ключ дедупликации: «Flash  of Light» и «flash of light» — одно слово */
export function normalizeTerm(term: string): string {
  return term.trim().toLowerCase().replace(/\s+/g, ' ')
}

function matchesFilters(entry: DictionaryEntry, filters: DictionaryFilters): boolean {
  if (filters.level === 'none') {
    if (entry.level) return false
  } else if (filters.level && entry.level !== filters.level) return false

  if (filters.host && sourceHost(entry) !== filters.host) return false

  if (filters.onlyWithExplanation && !entry.explanation) return false

  const search = normalizeTerm(filters.search)
  if (!search) return true

  // ищем и по переводу с пояснением: слово вспоминается то с одной стороны, то с другой
  return [entry.original, entry.translate, entry.context, entry.explanation]
    .some((field) => typeof field === 'string' && normalizeTerm(field).includes(search))
}

const SORTERS: Record<DictionarySort, (a: DictionaryEntry, b: DictionaryEntry) => number> = {
  newest: (a, b) => b.addedAt - a.addedAt,
  oldest: (a, b) => a.addedAt - b.addedAt,
  alphabetical: (a, b) => a.original.localeCompare(b.original, 'en'),
}

/** Удалённые записи (надгробия) наружу не отдаём никогда */
export function queryEntries(
  entries: DictionaryEntry[],
  filters: DictionaryFilters,
  sort: DictionarySort,
): DictionaryEntry[] {
  return entries
    .filter((entry) => !entry.deletedAt && matchesFilters(entry, filters))
    .sort(SORTERS[sort])
}

/** Уровни, реально встречающиеся в словаре, — из них собирается фильтр */
export function collectLevels(entries: DictionaryEntry[]): CefrLevel[] {
  const levels = new Set<CefrLevel>()

  for (const entry of entries) {
    if (!entry.deletedAt && entry.level) levels.add(entry.level)
  }

  return Array.from(levels).sort()
}

export type LevelOption = { label: string; value: LevelFilter }

/** Пункт «Без уровня» появляется, только если такие записи есть */
export function levelFilterOptions(entries: DictionaryEntry[]): LevelOption[] {
  const options: LevelOption[] = collectLevels(entries).map((level) => ({
    label: level,
    value: level,
  }))

  if (entries.some((entry) => !entry.deletedAt && !entry.level)) {
    options.push({ label: 'Без уровня', value: 'none' })
  }

  return options
}

export type HostOption = { label: string; value: string }

/** Хосты, реально встречающиеся в словаре; частые — выше, число записей в подписи */
export function hostFilterOptions(entries: DictionaryEntry[]): HostOption[] {
  const counts = new Map<string, number>()

  for (const entry of entries) {
    if (entry.deletedAt) continue

    const host = sourceHost(entry)
    if (host) counts.set(host, (counts.get(host) ?? 0) + 1)
  }

  return Array.from(counts, ([host, count]) => ({ label: `${host} (${count})`, value: host }))
    .sort((a, b) => (counts.get(b.value) ?? 0) - (counts.get(a.value) ?? 0) || a.value.localeCompare(b.value))
}

/**
 * Записи, до которых перевод не доехал: слово попало в словарь, пока источник
 * молчал — не знал его, отказал по ключу или кончилась квота.
 */
export function untranslatedEntries(entries: DictionaryEntry[]): DictionaryEntry[] {
  return entries.filter((entry) => !entry.translate.trim() && !entry.deletedAt)
}

/**
 * Резать список на пачки: словарь бывает на сотни слов, а залп из сотни запросов
 * подряд бесключевые переводчики встречают капчей или молчанием.
 */
export function chunk<T>(list: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let index = 0; index < list.length; index += size) chunks.push(list.slice(index, index + size))

  return chunks
}
