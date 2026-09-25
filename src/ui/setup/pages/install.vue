<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ExternalLink } from 'lucide-vue-next'
import AccessSites from '@/components/accessSites.vue'
import AppLoader from '@/components/AppLoader.vue'
import FormField from '@/components/FormField.vue'
import SectionPanel from '@/components/SectionPanel.vue'
import InlineSvg from '@/components/InlineSvg.vue'
import welcomeArt from '@/assets/illustrations/welcome.svg?raw'
import { DEMO_URL, useAccessSites } from '@/composables/useAccessSites'
import { useDemoDictionary } from '@/composables/useDemoDictionary'
import { useReaderSettings } from '@/composables/useReaderSettings'
import { PROFILE_LANG } from '@/utils/analyze'
import { clampDemoLevel, type DemoLevel } from '@/utils/demoDictionary'
import { LANGUAGES } from '@/utils/languages'
import { FAQ_URL } from '@/utils/dictionaryTab'
import { CEFR_LEVELS } from '@/types/words'

const { t } = useI18n()
const { settings } = useReaderSettings()
const { isUrlAllowed } = useAccessSites()
const { demoState, loadDemo } = useDemoDictionary()

const displayName = __DISPLAY_NAME__
const faqUrl = browser.runtime.getURL(FAQ_URL)

// computed
/** Демо-страницу предлагаем, только пока она разрешена: сайт из списка можно убрать,
 * а в режиме «везде, кроме» его туда, наоборот, могли внести */
const demoUrl = computed<string | undefined>(() =>
  isUrlAllowed(DEMO_URL) ? DEMO_URL : undefined,
)

// разбор без модели держится на профиле CEFR, а он собран только по английскому
const needsModel = computed<boolean>(() => settings.value.sourceLang !== PROFILE_LANG)
/** Набора для A1 и C2 нет: на них подсветке нечего показать на обычной странице */
const demoLevel = computed<DemoLevel>(() => clampDemoLevel(settings.value.level))

// методы
function openOptions(): void {
  browser.runtime.openOptionsPage()
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h2 class="m-0 text-2xl font-semibold">
        {{ t('setup.installed', { name: displayName }) }}
      </h2>
      <p class="m-0 text-muted">
        {{ t('setup.installedSubtitle') }}
      </p>
    </div>

    <!-- картинка вместо описания: что расширение делает со страницей, видно быстрее,
         чем читается абзац -->
    <div class="flex justify-center">
      <InlineSvg
        :markup="welcomeArt"
        class="w-56 text-content"
      />
    </div>

    <!-- список, а не набор карточек: шагов три и порядок у них важен -->
    <ol class="m-0 flex list-none flex-col gap-6 p-0">
      <li>
        <SectionPanel class="gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="m-0 text-base font-semibold">
              {{ t('setup.stepLevel') }}
            </h3>
            <p class="m-0 text-muted">
              {{ t('setup.stepLevelHint') }}
            </p>
          </div>

          <div class="grid gap-4 sm:grid-cols-3">
            <FormField
              :label="t('settings.language.level')"
              input-id="setup-level"
            >
              <Select
                id="setup-level"
                v-model="settings.level"
                :options="[...CEFR_LEVELS]"
                class="w-full"
              />
            </FormField>

            <FormField
              :label="t('settings.language.source')"
              input-id="setup-source"
            >
              <Select
                id="setup-source"
                v-model="settings.sourceLang"
                :options="LANGUAGES"
                option-label="native"
                option-value="code"
                class="w-full"
              />
            </FormField>

            <FormField
              :label="t('settings.language.target')"
              input-id="setup-target"
            >
              <Select
                id="setup-target"
                v-model="settings.targetLang"
                :options="LANGUAGES"
                option-label="native"
                option-value="code"
                class="w-full"
              />
            </FormField>
          </div>
        </SectionPanel>
      </li>

      <li>
        <SectionPanel class="gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="m-0 text-base font-semibold">
              {{ t('setup.stepSites') }}
            </h3>
            <p class="m-0 text-muted">
              {{ t('setup.stepSitesHint') }}
            </p>
          </div>

          <AccessSites />
        </SectionPanel>
      </li>

      <li>
        <SectionPanel class="gap-4">
          <div class="flex flex-col gap-1">
            <h3 class="m-0 text-base font-semibold">
              {{ t('setup.stepReady') }}
            </h3>
            <p class="m-0 text-muted">
              {{ t(needsModel ? 'setup.stepReadyModel' : 'setup.stepReadyHint') }}
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2">
            <Button
              v-if="demoUrl && !needsModel"
              as="a"
              :href="demoUrl"
              target="_blank"
              rel="noreferrer noopener"
              :label="t('setup.tryIt')"
            >
              <template #icon>
                <ExternalLink :size="16" />
              </template>
            </Button>

            <!-- словарь пуст после установки: без слов ни подсветки сохранённого,
               ни тренировки, ни экспорта в Anki не увидеть -->
            <Button
              v-if="!needsModel"
              severity="secondary"
              outlined
              :label="demoState.busy ? t('dictionary.demoBusy') : t('dictionary.demo', { level: demoLevel })"
              :title="t('dictionary.demoHint')"
              :disabled="demoState.busy"
              @click="loadDemo(demoLevel)"
            >
              <template
                v-if="demoState.busy"
                #icon
              >
                <AppLoader
                  variant="swap"
                  :size="16"
                />
              </template>
            </Button>

            <Button
              :label="t(needsModel ? 'setup.connectModel' : 'common.openSettings')"
              :severity="needsModel ? 'primary' : 'secondary'"
              :outlined="!needsModel"
              @click="openOptions"
            />

            <!-- справка рядом с первым запуском: вопросы про уровень и список сайтов
               возникают именно здесь, а не когда пользователь дойдёт до настроек -->
            <a
              :href="faqUrl"
              target="_blank"
              rel="noreferrer noopener"
              class="px-2 text-muted underline decoration-line underline-offset-4 hover:text-content"
            >
              {{ t('nav.faq') }}
            </a>
          </div>

          <Message
            v-if="demoState.message"
            :severity="demoState.failed ? 'error' : 'success'"
            :closable="false"
          >
            {{ demoState.message }}
          </Message>
        </SectionPanel>
      </li>
    </ol>
  </div>
</template>
