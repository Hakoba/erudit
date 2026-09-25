import type { DictionaryProgress } from '@/utils/srs'

/**
 * Стадии слова одним списком: он задаёт порядок дуг в кольце и строк в легенде.
 * Классы прописаны целиком — из склеенных имён Tailwind ничего не собирает. `brand`
 * в цвета стадий не годится: в этой теме это тот же янтарь, что и у «новых».
 */
export const TRAINING_STAGES: { key: keyof DictionaryProgress; labelKey: string; stroke: string; dot: string }[] = [
  { key: 'learned', labelKey: 'training.learned', stroke: 'stroke-mark-saved', dot: 'bg-mark-saved' },
  { key: 'learning', labelKey: 'training.learning', stroke: 'stroke-learning', dot: 'bg-learning' },
  { key: 'fresh', labelKey: 'training.fresh', stroke: 'stroke-mark-new', dot: 'bg-mark-new' },
]
