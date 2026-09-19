import { ref, type Ref } from 'vue'
import { useDictionary } from './useDictionary'
import type { DictionaryEntry } from '@/types/words'
import { chunk } from '@/utils/dictionary'
import { t } from '@/utils/i18n'
import { dictTranslateMany } from '@/utils/translateTerm'

/** Пачка запросов за раз: залпом на весь словарь бесключевые переводчики отвечают капчей */
const FILL_BATCH = 5

export type FillState = {
  busy: boolean
  done: number
  total: number
  message: string
  failed: boolean
}

const EMPTY_STATE: FillState = { busy: false, done: 0, total: 0, message: '', failed: false }

/**
 * Дозаполнить пустые переводы выбранным источником. Общий путь для кнопки на
 * странице словаря и для демо-набора: отказ переводчика ловится в одном месте.
 */
export function useFillTranslations(): {
  fillState: Ref<FillState>
  fillTranslations: (list: DictionaryEntry[]) => Promise<void>
} {
  // composables
  const { updateEntry } = useDictionary()

  // state
  const fillState = ref<FillState>({ ...EMPTY_STATE })

  // методы
  /**
   * Пачками, а не залпом; отказ на одном слове остальных не отменяет, а общий
   * отказ — например, кончившаяся квота — приходит сообщением в `error`.
   */
  async function fillTranslations(list: DictionaryEntry[]): Promise<void> {
    if (!list.length || fillState.value.busy) return

    fillState.value = { ...EMPTY_STATE, busy: true, total: list.length }
    let filled = 0
    let error = ''

    for (const batch of chunk(list, FILL_BATCH)) {
      const outcome = await dictTranslateMany(batch.map((item) => item.original))

      batch.forEach((item, index) => {
        const translate = outcome.values[index]
        if (!translate) return

        updateEntry(item.id, { translate })
        filled += 1
      })
      fillState.value.done += batch.length
      if (outcome.error) {
        error = outcome.error
        break
      }
    }

    const left = list.filter((item) => !item.translate.trim()).length

    fillState.value = {
      ...EMPTY_STATE,
      failed: Boolean(error),
      message: error || t('dictionary.fillDone', { filled, left }),
    }
  }

  return { fillState, fillTranslations }
}
