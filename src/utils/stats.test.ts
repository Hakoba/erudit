import assert from 'node:assert/strict'
import { test } from 'node:test'
import type { DictionaryEntry } from '@/types/words'
import { levelCounts, topByCount, weekStart, weeklyCounts } from './stats'

const DAY = 24 * 60 * 60 * 1000
const NOW = 1_000 * DAY

function entry(patch: Partial<DictionaryEntry> = {}): DictionaryEntry {
  return { id: 'id', original: 'word', translate: 'слово', addedAt: 0, updatedAt: 0, ...patch }
}

test('weeklyCounts: метки ложатся в свою неделю, вне окна не считаются', () => {
  const counts = weeklyCounts(
    [NOW, NOW - 6 * DAY, NOW - 7 * DAY - 1, NOW - 11 * 7 * DAY - 6 * DAY, NOW - 12 * 7 * DAY, NOW + DAY],
    NOW,
    12,
  )

  assert.equal(counts.length, 12)
  assert.equal(counts[11], 2)
  assert.equal(counts[10], 1)
  assert.equal(counts[0], 1)
  assert.equal(counts.reduce((sum, count) => sum + count, 0), 4)
})

test('weeklyCounts: пустой вход — нули нужной длины', () => {
  assert.deepEqual(weeklyCounts([], NOW, 3), [0, 0, 0])
})

test('weekStart: последняя неделя начинается семь дней назад', () => {
  assert.equal(weekStart(11, NOW, 12), NOW - 7 * DAY)
  assert.equal(weekStart(0, NOW, 12), NOW - 12 * 7 * DAY)
})

test('topByCount: сортировка по числу, потом по алфавиту; доля от всех; пустой ключ мимо', () => {
  const top = topByCount(['b', 'a', 'b', '', 'c', 'a', 'd'], (item) => item, 2)

  assert.deepEqual(top, [
    { key: 'a', count: 2, share: 2 / 6 },
    { key: 'b', count: 2, share: 2 / 6 },
  ])
  assert.deepEqual(topByCount([], (item: string) => item), [])
})

test('levelCounts: все уровни присутствуют, надгробия и записи без уровня не считаются', () => {
  const counts = levelCounts([
    entry({ level: 'B1' }),
    entry({ level: 'B1' }),
    entry({ level: 'C1', deletedAt: 1 }),
    entry(),
  ])

  assert.deepEqual(counts, { A1: 0, A2: 0, B1: 2, B2: 0, C1: 0, C2: 0 })
})
