import { hostOf } from './url'

// Журнал разборов страниц. Без браузерных API — тестируется в node.

export const READING_LOG_KEY = 'READING_LOG'
/** Сообщение оверлея в background: разбор страницы завершился успешно */
export const READING_LOG_EVENT = 'nt/reading-log'
/** Двенадцати недель графика хватает с запасом; старше — только место в storage */
export const READING_LOG_RETENTION_DAYS = 90

const DAY_MS = 24 * 60 * 60 * 1000

/**
 * Одна страница за один день — одна запись. Догрузка ленты и повторный разбор
 * той же страницы не считаются новыми страницами: они прибавляют слова.
 */
export interface ReadingLogEntry {
  /** Локальная полночь дня разбора */
  day: number
  /** origin + pathname, без query и хэша — как `sourceUrl` у записи словаря */
  url: string
  /** Сложных слов найдено на странице за день */
  words: number
}

export interface ReadingEvent {
  url: string
  words: number
  /** Страницу перечитали с нуля: слова заменяются, а не прибавляются */
  full: boolean
}

export function isReadingEvent(value: unknown): value is ReadingEvent {
  if (typeof value !== 'object' || value === null) return false
  const event: Record<string, unknown> = { ...value }

  return typeof event.url === 'string' && typeof event.words === 'number' && typeof event.full === 'boolean'
}

/** Адрес без query и хэша; неразбираемый — как есть, чтобы событие не потерялось */
export function pageKey(url: string): string {
  try {
    const { origin, pathname } = new URL(url)

    return origin + pathname
  } catch {
    return url
  }
}

/** Полночь по местному времени: статистика по дням читателя, а не по Гринвичу */
export function startOfDay(timestamp: number): number {
  const date = new Date(timestamp)
  date.setHours(0, 0, 0, 0)

  return date.getTime()
}

export function readingHost(entry: ReadingLogEntry): string {
  return hostOf(entry.url)
}

/** Новый массив: запись за тот же день и адрес обновляется, иначе добавляется */
export function recordReading(log: ReadingLogEntry[], event: ReadingEvent, now: number): ReadingLogEntry[] {
  const day = startOfDay(now)
  const url = pageKey(event.url)
  const existing = log.find((entry) => entry.day === day && entry.url === url)

  if (!existing) return [...log, { day, url, words: event.words }]

  const words = event.full ? event.words : existing.words + event.words

  return log.map((entry) => (entry === existing ? { ...entry, words } : entry))
}

export function pruneReadingLog(
  log: ReadingLogEntry[],
  now: number,
  retentionDays = READING_LOG_RETENTION_DAYS,
): ReadingLogEntry[] {
  const cutoff = startOfDay(now) - retentionDays * DAY_MS

  return log.filter((entry) => entry.day >= cutoff)
}
