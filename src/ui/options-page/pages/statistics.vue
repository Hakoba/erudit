<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import InlineSvg from '@/components/InlineSvg.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import emptyArt from '@/assets/illustrations/dictionary-empty.svg?raw'
import StatBarRow from '../components/StatBarRow.vue'
import TrainingProgressRing from '../components/TrainingProgressRing.vue'
import { TRAINING_STAGES } from '../components/trainingStages'
import WeeklyBars from '../components/WeeklyBars.vue'
import { useDictionary } from '@/composables/useDictionary'
import { useReadingLog } from '@/composables/useReadingLog'
import { sourceHost } from '@/utils/dictionary'
import { readingHost } from '@/utils/readingLog'
import { STATS_WEEKS, levelCounts, topByCount, weekStart, weeklyCounts, type RankedShare } from '@/utils/stats'
import { countProgress, type DictionaryProgress } from '@/utils/srs'
import { CEFR_LEVELS } from '@/types/words'

/**
 * Срез по словарю и журнал разборов. Всё считается на лету из двух хранилищ,
 * своих данных у страницы нет: словарь — `useDictionary`, журнал — `useReadingLog`.
 */

// composables
const { t, locale } = useI18n()
const { entries } = useDictionary()
const { log } = useReadingLog()

// computed
const progress = computed<DictionaryProgress>(() => countProgress(entries.value))
const levels = computed<Record<string, number>>(() => levelCounts(entries.value))
const maxLevel = computed<number>(() => Math.max(...Object.values(levels.value), 1))
// «сейчас» берётся при каждом пересчёте: страница может жить открытой днями,
// а окно недель должно двигаться вместе с новыми записями
const addedPerWeek = computed<number[]>(() => weeklyCounts(entries.value.map((entry) => entry.addedAt), Date.now()))
const wordSources = computed<RankedShare[]>(() => topByCount(entries.value, sourceHost))

const pagesRead = computed<number>(() => log.value.length)
const wordsFound = computed<number>(() => log.value.reduce((sum, entry) => sum + entry.words, 0))
const pagesPerWeek = computed<number[]>(() => weeklyCounts(log.value.map((entry) => entry.day), Date.now()))
const readingSites = computed<RankedShare[]>(() => topByCount(log.value, readingHost))

const weeksStartLabel = computed<string>(() => formatDay(weekStart(0, Date.now())))
const weeksEndLabel = computed<string>(() => formatDay(Date.now()))

// методы
/** Топ отсортирован по убыванию: максимум — первая строка */
function largestCount(sites: RankedShare[]): number {
  return sites[0]?.count ?? 1
}

function formatDay(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString(locale.value, { day: 'numeric', month: 'short' })
}
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-6">
    <h2 class="m-0 text-2xl font-semibold">
      {{ t('stats.title') }}
    </h2>

    <SectionPanel
      v-if="!entries.length"
      class="items-center py-8 text-center"
    >
      <InlineSvg
        :markup="emptyArt"
        class="w-40 text-content"
      />
      <p class="m-0 max-w-sm text-muted">
        {{ t('stats.dictionaryEmpty') }}
      </p>
    </SectionPanel>

    <template v-else>
      <SectionPanel :title="t('stats.dictionary')">
        <div class="flex flex-wrap items-center gap-x-10 gap-y-6">
          <div class="relative size-36 shrink-0">
            <TrainingProgressRing
              :progress="progress"
              :stages="TRAINING_STAGES"
            />
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-3xl font-semibold tabular-nums">{{ entries.length }}</span>
              <span class="text-xs text-muted">{{ t('training.total') }}</span>
            </div>
          </div>

          <dl class="m-0 flex flex-col gap-3">
            <div
              v-for="stage in TRAINING_STAGES"
              :key="stage.key"
              class="flex items-center gap-3"
            >
              <span
                class="size-2.5 shrink-0 rounded-full"
                :class="stage.dot"
                aria-hidden="true"
              />
              <dt class="min-w-28 text-muted">{{ t(stage.labelKey) }}</dt>
              <dd class="m-0 text-lg font-medium tabular-nums">{{ progress[stage.key] }}</dd>
            </div>
          </dl>
        </div>

        <div class="flex flex-col gap-2">
          <h4 class="m-0 text-sm font-medium text-muted">
            {{ t('stats.byLevel') }}
          </h4>
          <ul class="m-0 flex list-none flex-col gap-2 p-0">
            <StatBarRow
              v-for="level in CEFR_LEVELS"
              :key="level"
              :label="level"
              :value="levels[level] ?? 0"
              :max="maxLevel"
            />
          </ul>
        </div>
      </SectionPanel>

      <SectionPanel :title="t('stats.addedPerWeek', { weeks: STATS_WEEKS })">
        <WeeklyBars
          :counts="addedPerWeek"
          :start-label="weeksStartLabel"
          :end-label="weeksEndLabel"
          color-class="bg-mark-new"
        />
      </SectionPanel>

      <SectionPanel
        v-if="wordSources.length"
        :title="t('stats.wordSources')"
      >
        <ul class="m-0 flex list-none flex-col gap-2 p-0">
          <StatBarRow
            v-for="site in wordSources"
            :key="site.key"
            :label="site.key"
            :value="site.count"
            :max="largestCount(wordSources)"
            :share="site.share"
            color-class="bg-mark-saved"
          />
        </ul>
      </SectionPanel>
    </template>

    <SectionPanel :title="t('stats.reading')">
      <p
        v-if="!log.length"
        class="m-0 text-muted"
      >
        {{ t('stats.readingEmpty') }}
      </p>

      <template v-else>
        <!-- число сверху, подпись под ним: порядок в разметке остаётся dt → dd -->
        <dl class="m-0 flex flex-wrap gap-x-10 gap-y-3">
          <div class="flex flex-col-reverse">
            <dt class="text-xs text-muted">{{ t('stats.pages', { count: pagesRead }, pagesRead) }}</dt>
            <dd class="m-0 text-3xl font-semibold tabular-nums">{{ pagesRead }}</dd>
          </div>
          <div class="flex flex-col-reverse">
            <dt class="text-xs text-muted">{{ t('stats.wordsFound', { count: wordsFound }, wordsFound) }}</dt>
            <dd class="m-0 text-3xl font-semibold tabular-nums">{{ wordsFound }}</dd>
          </div>
        </dl>

        <div class="flex flex-col gap-2">
          <h4 class="m-0 text-sm font-medium text-muted">
            {{ t('stats.pagesPerWeek', { weeks: STATS_WEEKS }) }}
          </h4>
          <WeeklyBars
            :counts="pagesPerWeek"
            :start-label="weeksStartLabel"
            :end-label="weeksEndLabel"
            color-class="bg-learning"
          />
        </div>

        <div class="flex flex-col gap-2">
          <h4 class="m-0 text-sm font-medium text-muted">
            {{ t('stats.readingSites') }}
          </h4>
          <ul class="m-0 flex list-none flex-col gap-2 p-0">
            <StatBarRow
              v-for="site in readingSites"
              :key="site.key"
              :label="site.key"
              :value="site.count"
              :max="largestCount(readingSites)"
              :share="site.share"
              color-class="bg-learning"
            />
          </ul>
        </div>
      </template>
    </SectionPanel>
  </div>
</template>
