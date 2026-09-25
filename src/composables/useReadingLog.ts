import type { Ref } from 'vue'
import { useBrowserLocalStorage } from './useBrowserStorage'
import { READING_LOG_KEY, type ReadingLogEntry } from '@/utils/readingLog'

// массив, а не объект по дням: mergeDeep в useBrowserStorage идёт по ключам дефолта
const { data, promise } = useBrowserLocalStorage<ReadingLogEntry[]>(READING_LOG_KEY, [])

/** Только чтение: пишет журнал background по событиям оверлея (`background/readingLog.ts`) */
export function useReadingLog(): { log: Ref<ReadingLogEntry[]>; promise: Promise<unknown> } {
  return { log: data, promise }
}
