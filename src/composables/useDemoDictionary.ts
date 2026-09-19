import { ref, type Ref } from 'vue'
import { useDictionary } from './useDictionary'
import { useFillTranslations } from './useFillTranslations'
import { untranslatedEntries } from '@/utils/dictionary'
import { DEMO_WORDS, type DemoLevel } from '@/utils/demoDictionary'
import { t } from '@/utils/i18n'

export type DemoState = { busy: boolean; message: string; failed: boolean }

/**
 * Набор слов уровня одной кнопкой: словарь не пустой с первой минуты, и подсветка,
 * тренировка и экспорт есть что показать. Записи обычные, «демо» о себе не помнят.
 */
export function useDemoDictionary(): {
  demoState: Ref<DemoState>
  loadDemo: (level: DemoLevel) => Promise<void>
} {
  // composables
  const { addEntry } = useDictionary()
  const { fillState, fillTranslations } = useFillTranslations()

  // state
  const demoState = ref<DemoState>({ busy: false, message: '', failed: false })

  // методы
  /** Дубли отсекает сам словарь: `addEntry` ищет запись по нормализованному слову */
  async function loadDemo(level: DemoLevel): Promise<void> {
    if (demoState.value.busy) return

    demoState.value = { busy: true, message: '', failed: false }
    const added = DEMO_WORDS[level].map((original) => addEntry({ original, translate: '', level }))

    // отказ переводчика записи не откатывает: слова остаются в словаре без перевода
    await fillTranslations(untranslatedEntries(added))

    demoState.value = {
      busy: false,
      failed: fillState.value.failed,
      message: fillState.value.failed
        ? t('dictionary.demoFailed', { reason: fillState.value.message })
        : t('dictionary.demoDone', { level, count: added.length }),
    }
  }

  return { demoState, loadDemo }
}
