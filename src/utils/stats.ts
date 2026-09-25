import type { CefrLevel, DictionaryEntry } from '@/types/words'

// Сводки для страницы статистики. Без браузерных API — тестируется в node.

export const STATS_WEEKS = 12
export const TOP_SITES = 5

const DAY_MS = 24 * 60 * 60 * 1000
const WEEK_MS = 7 * DAY_MS

/**
 * Скользящие недели: последняя заканчивается сейчас, а не в воскресенье.
 * Календарная неделя зависит от локали, а столбик текущей недели в понедельник
 * был бы пустым. Индекс 0 — самая старая неделя.
 */
export function weeklyCounts(timestamps: number[], now: number, weeks = STATS_WEEKS): number[] {
  const counts = new Array<number>(weeks).fill(0)
  const start = now - weeks * WEEK_MS

  for (const timestamp of timestamps) {
    if (timestamp <= start || timestamp > now) continue

    const index = Math.min(weeks - 1, Math.floor((timestamp - start - 1) / WEEK_MS))
    counts[index] = (counts[index] ?? 0) + 1
  }

  return counts
}

/** Начало недели по её индексу — для подписи под столбиком */
export function weekStart(index: number, now: number, weeks = STATS_WEEKS): number {
  return now - (weeks - index) * WEEK_MS
}

export interface RankedShare {
  key: string
  count: number
  /** Доля от всех элементов с ключом, а не только от попавших в топ */
  share: number
}

/** Самые частые ключи; пустой ключ не считается, равные по числу идут по алфавиту */
export function topByCount<T>(items: T[], getKey: (item: T) => string, limit = TOP_SITES): RankedShare[] {
  const counts = new Map<string, number>()

  for (const item of items) {
    const key = getKey(item)
    if (key) counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  const total = [...counts.values()].reduce((sum, count) => sum + count, 0)

  return [...counts.entries()]
    .sort(([keyA, countA], [keyB, countB]) => countB - countA || keyA.localeCompare(keyB))
    .slice(0, limit)
    .map(([key, count]) => ({ key, count, share: total ? count / total : 0 }))
}

/** Слов на каждом уровне: все шесть уровней, даже нулевые; без уровня не считаются */
export function levelCounts(entries: DictionaryEntry[]): Record<CefrLevel, number> {
  const counts: Record<CefrLevel, number> = { A1: 0, A2: 0, B1: 0, B2: 0, C1: 0, C2: 0 }

  for (const entry of entries) {
    if (!entry.deletedAt && entry.level) counts[entry.level] += 1
  }

  return counts
}
