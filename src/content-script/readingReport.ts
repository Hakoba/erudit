import browser from 'webextension-polyfill'
import { READING_LOG_EVENT, type ReadingEvent } from '@/utils/readingLog'

/**
 * Журнал разборов пишет background, а не content script: писатель один, и ни одна
 * вкладка не держит журнал в памяти ради одной записи. Ответ не нужен, потеря
 * события при перезагрузке расширения — не беда.
 */
export function reportReading(words: number, full: boolean): void {
  const event: ReadingEvent = { url: location.href, words, full }
  void browser.runtime.sendMessage({ type: READING_LOG_EVENT, event }).catch(() => undefined)
}
