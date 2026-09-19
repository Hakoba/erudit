import type { CefrLevel } from '@/types/words'

/**
 * Наборы слов для непустого словаря сразу после установки. Подобраны руками:
 * профиль CEFR алфавитный и без частотности, выборка из него даёт слова,
 * которых на странице не встретишь, и подсветка не показывается.
 * Только английский — профиль собран по нему одному.
 */

export const DEMO_LEVELS = ['A2', 'B1', 'B2', 'C1'] as const

export type DemoLevel = (typeof DEMO_LEVELS)[number]

export const DEMO_WORDS: Record<DemoLevel, string[]> = {
  A2: [
    'actually', 'afraid', 'although', 'amazing', 'anyway', 'available', 'awful', 'boring',
    'careful', 'certainly', 'comfortable', 'dangerous', 'decide', 'definitely', 'describe',
    'disappointed', 'embarrassed', 'expensive', 'familiar', 'fortunately', 'honest', 'immediately',
    'improve', 'include', 'instead', 'lucky', 'mention', 'necessary', 'nervous', 'obviously',
    'opinion', 'perhaps', 'popular', 'probably', 'promise', 'provide', 'realize', 'recently',
    'seriously', 'worried',
  ],
  B1: [
    'accurate', 'admit', 'advantage', 'anxious', 'apparently', 'appreciate', 'approach',
    'assume', 'attitude', 'avoid', 'aware', 'benefit', 'challenge', 'complain', 'confident',
    'convince', 'curious', 'deserve', 'encourage', 'eventually', 'evidence', 'exhausted',
    'genuine', 'guilty', 'hesitate', 'ignore', 'impressive', 'insist', 'nevertheless',
    'occasionally', 'opportunity', 'otherwise', 'overwhelming', 'particularly', 'pretend',
    'pursue', 'recognize', 'relevant', 'reluctant', 'ridiculous',
  ],
  B2: [
    'accountable', 'acknowledge', 'adequate', 'ambiguous', 'anticipate', 'arbitrary',
    'assess', 'bias', 'coherent', 'compelling', 'comprehensive', 'consequence', 'consistent',
    'constraint', 'controversial', 'crucial', 'deliberate', 'elaborate', 'emphasize', 'evaluate',
    'exaggerate', 'explicit', 'feasible', 'hindsight', 'implication', 'inevitable', 'inherent',
    'insight', 'integrity', 'justify', 'legitimate', 'mundane', 'notion', 'nuance', 'plausible',
    'presumably', 'redundant', 'subtle', 'tedious', 'undermine',
  ],
  C1: [
    'alleviate', 'ambivalent', 'anecdotal', 'arguably', 'blatant', 'candid', 'caveat',
    'complacent', 'condescending', 'conducive', 'contentious', 'cynical', 'detrimental',
    'disingenuous', 'dubious', 'egregious', 'eloquent', 'exacerbate', 'facetious', 'fallacy',
    'futile', 'gratuitous', 'hypocrisy', 'indignant', 'insidious', 'meticulous', 'mitigate',
    'obnoxious', 'ostensibly', 'pedantic', 'perpetuate', 'pervasive', 'pragmatic', 'precarious',
    'pretentious', 'quintessential', 'scathing', 'superficial', 'ubiquitous', 'unprecedented',
  ],
}

/** A1 — «the, be, of», C2 на обычной странице почти не встречается: набора для них нет */
export function clampDemoLevel(level: CefrLevel): DemoLevel {
  if (level === 'A1') return 'A2'
  if (level === 'C2') return 'C1'

  return level
}
