<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionPanel from '@/components/SectionPanel.vue'
import { computed } from 'vue'
import FormField from '@/components/FormField.vue'
import InlineSvg from '@/components/InlineSvg.vue'
import readingArt from '@/assets/illustrations/reading.svg?raw'
import { PROMPT_EXTRA_LIMIT, SELECTION_MODES, WORD_ENGINES, useReaderSettings } from '@/composables/useReaderSettings'
import { LANGUAGES, UI_LANGUAGES } from '@/utils/languages'
import { PROFILE_LANG } from '@/utils/analyze'
import { CEFR_LEVELS } from '@/types/words'

const { t } = useI18n()
const { settings } = useReaderSettings()

const selectionOptions = computed<{ value: string; label: string }[]>(() =>
  SELECTION_MODES.map((mode) => ({ value: mode, label: t(`settings.analyze.selectionModes.${mode}`) })),
)

const engineOptions = computed<{ value: string; label: string }[]>(() =>
  WORD_ENGINES.map((engine) => ({ value: engine, label: t(`settings.analyze.engines.${engine}`) })),
)

/** Профиль CEFR собран только по английскому — на другом языке он не найдёт ничего */
const isProfileUseless = computed<boolean>(
  () => settings.value.engine === 'dictionary' && settings.value.sourceLang !== PROFILE_LANG,
)
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-6">
    <h2 class="m-0 text-2xl font-semibold">
      {{ t('nav.reading') }}
    </h2>

    <SectionPanel :title="t('settings.language.title')">
      <div class="grid gap-5 sm:grid-cols-3">
        <FormField
          :label="t('settings.language.level')"
          input-id="reader-level"
        >
          <Select
            id="reader-level"
            v-model="settings.level"
            :options="[...CEFR_LEVELS]"
            class="w-full"
          />
        </FormField>

        <FormField
          :label="t('settings.language.source')"
          input-id="source-lang"
        >
          <Select
            id="source-lang"
            v-model="settings.sourceLang"
            :options="LANGUAGES"
            option-label="native"
            option-value="code"
            class="w-full"
          />
        </FormField>

        <FormField
          :label="t('settings.language.target')"
          input-id="target-lang"
        >
          <Select
            id="target-lang"
            v-model="settings.targetLang"
            :options="LANGUAGES"
            option-label="native"
            option-value="code"
            class="w-full"
          />
        </FormField>
      </div>

      <!-- картинка объясняет главное: уровень — это порог, разбирается всё, что выше -->
      <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <InlineSvg
          :markup="readingArt"
          class="w-28 text-content"
        />
        <small class="min-w-56 flex-1 text-muted">
          {{ t('settings.language.hint') }}
        </small>
      </div>
    </SectionPanel>

    <SectionPanel :title="t('settings.analyze.title')">
      <FormField
        :label="t('settings.analyze.engine')"
        input-id="word-engine"
        :hint="t(`settings.analyze.engineHints.${settings.engine}`)"
      >
        <Select
          id="word-engine"
          v-model="settings.engine"
          :options="engineOptions"
          option-label="label"
          option-value="value"
          class="w-full sm:w-80"
        />
      </FormField>

      <Message
        v-if="isProfileUseless"
        severity="warn"
        size="small"
        variant="simple"
      >
        {{ t('settings.analyze.engineOnlyEnglish') }}
      </Message>

      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
          <ToggleSwitch
            v-model="settings.autoAnalyze"
            input-id="auto-analyze"
          />
          <label for="auto-analyze">
            {{ t('settings.analyze.autoAnalyze') }}
          </label>
        </div>
        <small class="text-muted">
          {{ t('settings.analyze.autoAnalyzeHint') }}
        </small>
      </div>

      <FormField
        :label="t('settings.analyze.selectionMode')"
        input-id="selection-mode"
        :hint="t(`settings.analyze.selectionHints.${settings.selectionMode}`)"
      >
        <Select
          id="selection-mode"
          v-model="settings.selectionMode"
          :options="selectionOptions"
          option-label="label"
          option-value="value"
          class="w-full sm:w-96"
        />
      </FormField>

      <!-- только при модели: без неё фразы и так переводит переводчик -->
      <div
        v-if="settings.engine === 'llm' && settings.selectionMode !== 'off'"
        class="flex flex-col gap-2"
      >
        <div class="flex items-center gap-2">
          <ToggleSwitch
            v-model="settings.llmPhrases"
            input-id="llm-phrases"
          />
          <label for="llm-phrases">
            {{ t('settings.analyze.llmPhrases') }}
          </label>
        </div>
        <small class="text-muted">
          {{ t('settings.analyze.llmPhrasesHint') }}
        </small>
      </div>

      <FormField
        :label="t('settings.analyze.promptExtra')"
        input-id="prompt-extra"
        :hint="t('settings.analyze.promptExtraHint', { left: PROMPT_EXTRA_LIMIT - settings.promptExtra.length })"
      >
        <Textarea
          id="prompt-extra"
          v-model="settings.promptExtra"
          rows="3"
          auto-resize
          :maxlength="PROMPT_EXTRA_LIMIT"
          :placeholder="t('settings.analyze.promptExtraPlaceholder')"
        />
      </FormField>
    </SectionPanel>

    <!-- язык интерфейса — не про чтение, поэтому отдельно и последним -->
    <SectionPanel :title="t('settings.interface.title')">
      <FormField
        :label="t('settings.language.ui')"
        input-id="ui-lang"
      >
        <Select
          id="ui-lang"
          v-model="settings.uiLang"
          :options="UI_LANGUAGES"
          option-label="native"
          option-value="code"
          class="w-full sm:w-80"
        />
      </FormField>
    </SectionPanel>
  </div>
</template>
