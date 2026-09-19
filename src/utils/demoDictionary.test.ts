import assert from 'node:assert/strict'
import { test } from 'node:test'
import { DEMO_LEVELS, DEMO_WORDS, clampDemoLevel } from './demoDictionary'

const WORDS_PER_LEVEL = 40

test('в каждом уровне ровно 40 слов без дублей и пробелов', () => {
  for (const level of DEMO_LEVELS) {
    const words = DEMO_WORDS[level]

    assert.equal(words.length, WORDS_PER_LEVEL, `${level}: не ${WORDS_PER_LEVEL} слов`)
    assert.equal(new Set(words).size, words.length, `${level}: есть дубли`)
    assert.deepEqual(words.filter((word) => word !== word.trim().toLowerCase() || /\s/.test(word)), [])
  }
})

test('наборы не пересекаются между уровнями', () => {
  const all = DEMO_LEVELS.flatMap((level) => DEMO_WORDS[level])

  assert.equal(new Set(all).size, all.length, 'слово встречается в двух уровнях')
})

test('clampDemoLevel: A1 и C2 подменяются ближайшим набором', () => {
  assert.equal(clampDemoLevel('A1'), 'A2')
  assert.equal(clampDemoLevel('C2'), 'C1')
  assert.equal(clampDemoLevel('B2'), 'B2')
})
