<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionPanel from '@/components/SectionPanel.vue'
import AccessSites from '@/components/accessSites.vue'
import InlineSvg from '@/components/InlineSvg.vue'
import immersionArt from '@/assets/illustrations/immersion.svg?raw'
import { useAccessSites } from '@/composables/useAccessSites'
import { useReaderSettings } from '@/composables/useReaderSettings'

/**
 * Режим вкраплений — единственная фича, которая работает не на странице чтения,
 * а на страницах родного языка, поэтому одним тумблером в «Чтении» её не объяснить:
 * здесь тумблер, механика по шагам и то, чего режим не умеет.
 *
 * Список сайтов тот же, что у разбора: в режиме «только на этих» подмена не сработает
 * на сайте родного языка, пока его сюда не добавят, — а догадаться об этом
 * на странице «Сайты» нельзя, там речь про чтение.
 */
const { t } = useI18n()
const { settings } = useReaderSettings()
const { isDenyMode } = useAccessSites()

/** Ключи шагов и ограничений — в порядке показа */
const STEPS: string[] = ['detect', 'swap', 'answer', 'panel']
const LIMITS: string[] = ['limitScript', 'limitForms']
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-6">
    <h2 class="m-0 text-2xl font-semibold">
      {{ t('immersion.title') }}
    </h2>

    <SectionPanel class="flex-row flex-wrap items-center gap-x-6 gap-y-4">
      <InlineSvg
        :markup="immersionArt"
        class="w-28 text-content"
      />

      <div class="flex min-w-56 flex-1 flex-col gap-2">
        <div class="flex items-center gap-2">
          <ToggleSwitch
            v-model="settings.immersion"
            input-id="immersion"
          />
          <label for="immersion">
            {{ t('immersion.toggle') }}
          </label>
        </div>
        <small class="text-muted">
          {{ t('immersion.toggleHint') }}
        </small>
      </div>
    </SectionPanel>

    <SectionPanel
      :title="t('immersion.howTitle')"
      class="gap-3"
    >
      <ol class="m-0 flex flex-col gap-2 pl-5">
        <li
          v-for="step in STEPS"
          :key="step"
        >
          {{ t(`immersion.${step}`) }}
        </li>
      </ol>
    </SectionPanel>

    <SectionPanel
      :title="t('immersion.limitsTitle')"
      class="gap-3"
    >
      <ul class="m-0 flex flex-col gap-2 pl-5 text-muted">
        <li
          v-for="limit in LIMITS"
          :key="limit"
        >
          {{ t(`immersion.${limit}`) }}
        </li>
      </ul>
    </SectionPanel>

    <SectionPanel
      :title="t('immersion.sitesTitle')"
      class="gap-3"
    >
      <p class="m-0 text-muted">
        {{ t(isDenyMode ? 'immersion.sitesHintDeny' : 'immersion.sitesHintAllow') }}
      </p>
      <AccessSites />
    </SectionPanel>
  </div>
</template>
