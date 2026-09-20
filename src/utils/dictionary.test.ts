import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { DictionaryEntry } from '@/types/words'
import {
  EMPTY_FILTERS,
  chunk,
  collectLevels,
  hostFilterOptions,
  levelFilterOptions,
  normalizeTerm,
  pageSource,
  queryEntries,
  sourceHost,
  untranslatedEntries,
} from './dictionary'

function entry(patch: Partial<DictionaryEntry>): DictionaryEntry {
  return {
    id: patch.original ?? 'id',
    original: 'word',
    translate: 'слово',
    addedAt: 0,
    updatedAt: 0,
    ...patch,
  }
}

const ENTRIES: DictionaryEntry[] = [
  entry({ original: 'brittle', translate: 'хрупкий', level: 'C1', addedAt: 300 }),
  entry({ original: 'ancient', translate: 'древний', level: 'B1', addedAt: 100, explanation: 'о вещах и языках' }),
  entry({ original: 'cascade', translate: 'каскад', level: 'C1', addedAt: 200 }),
  entry({ original: 'deleted', translate: 'удалённое', addedAt: 400, deletedAt: 500 }),
]

const SOURCED: DictionaryEntry[] = [
  entry({ original: 'brittle', level: 'C1', sourceUrl: 'https://www.reddit.com/r/a/' }),
  entry({ original: 'cascade', level: 'B1', sourceUrl: 'https://www.reddit.com/r/b/' }),
  entry({ original: 'ancient', sourceUrl: 'https://news.ycombinator.com/item' }),
  entry({ original: 'plain' }),
  entry({ original: 'gone', sourceUrl: 'https://www.reddit.com/r/c/', deletedAt: 5 }),
]

test('normalizeTerm: регистр и лишние пробелы схлопываются', () => {
  assert.equal(normalizeTerm('  Flash   OF Light '), 'flash of light')
})

test('queryEntries: удалённые записи не отдаются', () => {
  const result = queryEntries(ENTRIES, EMPTY_FILTERS, 'newest')

  assert.deepEqual(result.map((item) => item.original), ['brittle', 'cascade', 'ancient'])
})

test('queryEntries: сортировка по алфавиту и по дате в обе стороны', () => {
  const names = (sort: 'newest' | 'oldest' | 'alphabetical'): string[] =>
    queryEntries(ENTRIES, EMPTY_FILTERS, sort).map((item) => item.original)

  assert.deepEqual(names('alphabetical'), ['ancient', 'brittle', 'cascade'])
  assert.deepEqual(names('oldest'), ['ancient', 'cascade', 'brittle'])
})

test('queryEntries: фильтр по уровню', () => {
  const result = queryEntries(ENTRIES, { ...EMPTY_FILTERS, level: 'C1' }, 'alphabetical')

  assert.deepEqual(result.map((item) => item.original), ['brittle', 'cascade'])
})

test('queryEntries: фильтр «только с пояснением»', () => {
  const result = queryEntries(ENTRIES, { ...EMPTY_FILTERS, onlyWithExplanation: true }, 'newest')

  assert.deepEqual(result.map((item) => item.original), ['ancient'])
})

test('queryEntries: поиск идёт и по переводу, и по пояснению', () => {
  const find = (search: string): string[] =>
    queryEntries(ENTRIES, { ...EMPTY_FILTERS, search }, 'newest').map((item) => item.original)

  assert.deepEqual(find('ANCI'), ['ancient'])
  assert.deepEqual(find('древний'), ['ancient'])
  assert.deepEqual(find('о вещах'), ['ancient'])
  assert.deepEqual(find('дракон'), [])
})

test('queryEntries: исходный массив не мутируется', () => {
  const source = [...ENTRIES]
  queryEntries(source, EMPTY_FILTERS, 'alphabetical')

  assert.deepEqual(source, ENTRIES)
})

test('collectLevels: только встречающиеся уровни, без удалённых, по порядку', () => {
  assert.deepEqual(collectLevels(ENTRIES), ['B1', 'C1'])
})

test('queryEntries: фильтр «без уровня» — только записи без level', () => {
  const withoutLevel = entry({ original: 'baritone', translate: 'баритон', addedAt: 50 })
  const result = queryEntries([...ENTRIES, withoutLevel], { ...EMPTY_FILTERS, level: 'none' }, 'newest')

  // удалённая запись тоже без уровня, но надгробия наружу не отдаются
  assert.deepEqual(result.map((item) => item.original), ['baritone'])
})

test('levelFilterOptions: «Без уровня» появляется, только когда такие записи есть', () => {
  assert.deepEqual(
    levelFilterOptions(ENTRIES).map((option) => option.value),
    ['B1', 'C1'],
  )

  const withoutLevel = entry({ original: 'baritone', translate: 'баритон' })
  assert.deepEqual(
    levelFilterOptions([...ENTRIES, withoutLevel]).map((option) => option.value),
    ['B1', 'C1', 'none'],
  )
})

test('pageSource: адрес теряет query и хэш, заголовок обрезается до 120 символов', () => {
  assert.deepEqual(
    pageSource('https://www.reddit.com/r/a/comments/1/slug/?ref=x#top', '  Post title  '),
    { sourceUrl: 'https://www.reddit.com/r/a/comments/1/slug/', sourceTitle: 'Post title' },
  )

  const long = pageSource('https://example.com/a', 'x'.repeat(200))
  assert.equal(long.sourceTitle?.length, 120)

  assert.deepEqual(pageSource('https://example.com/a', '   '), {
    sourceUrl: 'https://example.com/a',
    sourceTitle: undefined,
  })
})

test('pageSource: неразбираемый адрес источника не даёт', () => {
  assert.deepEqual(pageSource('', 'Post title'), {})
  assert.deepEqual(pageSource('not a url', 'Post title'), {})
})

test('sourceHost: хост из адреса, без источника — пусто', () => {
  assert.equal(sourceHost(entry({ sourceUrl: 'https://www.reddit.com/r/a/' })), 'www.reddit.com')
  assert.equal(sourceHost(entry({})), '')
})

test('queryEntries: фильтр по хосту сочетается с остальными', () => {
  const names = (filters: Partial<typeof EMPTY_FILTERS>): string[] =>
    queryEntries(SOURCED, { ...EMPTY_FILTERS, ...filters }, 'alphabetical').map((item) => item.original)

  assert.deepEqual(names({ host: 'www.reddit.com' }), ['brittle', 'cascade'])
  assert.deepEqual(names({ host: 'www.reddit.com', level: 'C1' }), ['brittle'])
  assert.deepEqual(names({ host: 'news.ycombinator.com' }), ['ancient'])
})

test('hostFilterOptions: только встречающиеся хосты, частые выше, удалённые не в счёт', () => {
  assert.deepEqual(hostFilterOptions(SOURCED), [
    { label: 'www.reddit.com (2)', value: 'www.reddit.com' },
    { label: 'news.ycombinator.com (1)', value: 'news.ycombinator.com' },
  ])

  assert.deepEqual(hostFilterOptions(ENTRIES), [])
})

test('untranslatedEntries: пустой перевод и пробелы считаются пропуском, удалённые — нет', () => {
  const list = [
    entry({ original: 'brittle', translate: 'хрупкий' }),
    entry({ original: 'gloom', translate: '' }),
    entry({ original: 'ripple', translate: '   ' }),
    entry({ original: 'shard', translate: '', deletedAt: 5 }),
  ]

  assert.deepEqual(untranslatedEntries(list).map((item) => item.original), ['gloom', 'ripple'])
})

test('chunk: последняя пачка неполная, пустой список даёт пустой результат', () => {
  assert.deepEqual(chunk([1, 2, 3, 4, 5], 2), [[1, 2], [3, 4], [5]])
  assert.deepEqual(chunk([], 3), [])
  assert.deepEqual(chunk([1, 2], 5), [[1, 2]])
})
