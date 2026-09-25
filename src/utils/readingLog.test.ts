import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  isReadingEvent,
  pageKey,
  pruneReadingLog,
  readingHost,
  recordReading,
  startOfDay,
  type ReadingLogEntry,
} from './readingLog'

const DAY = 24 * 60 * 60 * 1000
// полдень: полночь этого дня по местному времени однозначна
const NOW = new Date(2026, 8, 25, 12).getTime()
const TODAY = new Date(2026, 8, 25).getTime()

test('pageKey: query и хэш отрезаются, невалидный адрес остаётся как есть', () => {
  assert.equal(pageKey('https://a.com/x/y?q=1#top'), 'https://a.com/x/y')
  assert.equal(pageKey('not a url'), 'not a url')
})

test('startOfDay: любое время дня даёт одну полночь', () => {
  assert.equal(startOfDay(NOW), TODAY)
  assert.equal(startOfDay(TODAY + 23 * 60 * 60 * 1000), TODAY)
})

test('recordReading: новая страница — новая запись, старые не трогаются', () => {
  const log = recordReading([], { url: 'https://a.com/p?x=1', words: 5, full: false }, NOW)

  assert.deepEqual(log, [{ day: TODAY, url: 'https://a.com/p', words: 5 }])
})

test('recordReading: та же страница в тот же день прибавляет слова, полный разбор — заменяет', () => {
  let log = recordReading([], { url: 'https://a.com/p', words: 5, full: false }, NOW)
  log = recordReading(log, { url: 'https://a.com/p', words: 3, full: false }, NOW + 1000)
  assert.equal(log.length, 1)
  assert.equal(log[0]?.words, 8)

  log = recordReading(log, { url: 'https://a.com/p', words: 4, full: true }, NOW + 2000)
  assert.equal(log[0]?.words, 4)
})

test('recordReading: та же страница на другой день — отдельная запись', () => {
  let log = recordReading([], { url: 'https://a.com/p', words: 5, full: false }, NOW)
  log = recordReading(log, { url: 'https://a.com/p', words: 2, full: false }, NOW + DAY)

  assert.equal(log.length, 2)
})

test('pruneReadingLog: старше ретеншна вылетает, на границе остаётся', () => {
  const log: ReadingLogEntry[] = [
    { day: TODAY - 90 * DAY, url: 'https://a.com/1', words: 1 },
    { day: TODAY - 91 * DAY, url: 'https://a.com/2', words: 1 },
    { day: TODAY, url: 'https://a.com/3', words: 1 },
  ]

  assert.deepEqual(pruneReadingLog(log, NOW).map((entry) => entry.url), ['https://a.com/1', 'https://a.com/3'])
})

test('readingHost и isReadingEvent', () => {
  assert.equal(readingHost({ day: 0, url: 'https://www.a.com/p', words: 0 }), 'www.a.com')
  assert.equal(readingHost({ day: 0, url: 'zzz', words: 0 }), '')
  assert.equal(isReadingEvent({ url: 'x', words: 1, full: false }), true)
  assert.equal(isReadingEvent({ url: 'x', words: '1', full: false }), false)
  assert.equal(isReadingEvent(null), false)
})
