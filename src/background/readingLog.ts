import browser from 'webextension-polyfill'
import {
  READING_LOG_KEY,
  isReadingEvent,
  pruneReadingLog,
  recordReading,
  type ReadingLogEntry,
} from '@/utils/readingLog'

/**
 * Единственный писатель журнала. События с разных вкладок приходят вперемешку,
 * поэтому записи выстроены в цепочку: чтение-слияние-запись одного события
 * не начинается, пока не закончилось предыдущее.
 */
let queue: Promise<void> = Promise.resolve()

export function trackReading(event: unknown): void {
  if (!isReadingEvent(event)) return

  queue = queue.then(() => append(event)).catch((e: unknown) => {
    console.info('[nt] журнал разборов не записан:', e)
  })
}

async function append(event: { url: string; words: number; full: boolean }): Promise<void> {
  const stored: unknown = (await browser.storage.local.get(READING_LOG_KEY))[READING_LOG_KEY]
  const log: ReadingLogEntry[] = Array.isArray(stored) ? stored : []
  const now = Date.now()

  await browser.storage.local.set({
    [READING_LOG_KEY]: pruneReadingLog(recordReading(log, event, now), now),
  })
}
