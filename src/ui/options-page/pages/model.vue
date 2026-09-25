<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionPanel from '@/components/SectionPanel.vue'
import { ExternalLink } from 'lucide-vue-next'
import AppLoader from '@/components/AppLoader.vue'
import FormField from '@/components/FormField.vue'
import HostAccess from '@/components/HostAccess.vue'
import { useHostAccess } from '@/composables/useHostAccess'
import InlineSvg from '@/components/InlineSvg.vue'
import modelArt from '@/assets/illustrations/model.svg?raw'
import modelOfflineArt from '@/assets/illustrations/model-offline.svg?raw'
import {
  HAS_DEV_YANDEX_CREDENTIALS,
  LOCAL_PRESET,
  OPENAI_COMPATIBLE_PRESETS,
  YANDEX_PRESET,
  presetForProvider,
  useLlmSettings,
} from '@/composables/useLlmSettings'
import { PROVIDER_LIST, getProvider, type ProviderId } from '@/utils/llm/providers'
import { checkModel } from '@/utils/llmClient'

const { t } = useI18n()
const { settings } = useLlmSettings()
const { requestAccess } = useHostAccess()

// state
const checkState = ref<'idle' | 'busy' | 'ok' | 'fail'>('idle')
const checkMessage = ref<string>('')

// computed
/** Проверка перевешивает настройки: она знает наверняка, а адрес с моделью — только обещают */
const isLinked = computed<boolean>(() =>
  checkState.value === 'fail'
    ? false
    : checkState.value === 'ok' || Boolean(settings.value.baseUrl && settings.value.model),
)
const providerKeyUrl = computed<string | undefined>(() => getProvider(settings.value.provider).keyUrl)
// названия видов API живут в локалях: «OpenAI-совместимый» на английском звучит иначе
const providerOptions = computed<{ id: string; title: string }[]>(() =>
  PROVIDER_LIST.map(({ id }) => ({ id, title: t(`settings.model.providers.${id}`) })),
)

// методы
/**
 * Пресет — клик, а клик даёт право спросить доступ к хосту сразу, без второй кнопки.
 * Адрес, набранный руками, покрывает предупреждение `HostAccess` под полем.
 */
function apply(next: typeof settings.value): void {
  settings.value = next
  void requestAccess([next.baseUrl])
}

/** Смена вида API тянет адрес и модель: прежние в новом протоколе не работают */
function applyProvider(id: ProviderId): void {
  apply(presetForProvider(id))
}

function applyCompatiblePreset(preset: { baseUrl: string; model: string }): void {
  apply({
    ...settings.value,
    provider: 'openai',
    baseUrl: preset.baseUrl,
    model: preset.model,
  })
}

function applyLocalPreset(): void {
  apply({ ...LOCAL_PRESET })
}

function applyYandexPreset(): void {
  // в dev-сборке пресет уже содержит ключ и каталог из .env
  apply({ ...YANDEX_PRESET, apiKey: YANDEX_PRESET.apiKey || settings.value.apiKey })
}

async function runCheck(): Promise<void> {
  // проверка — тоже клик: заодно просим доступ, если адрес вписали руками
  await requestAccess([settings.value.baseUrl])
  checkState.value = 'busy'
  const started = performance.now()

  try {
    await checkModel()
    const seconds = ((performance.now() - started) / 1000).toFixed(1)
    checkMessage.value = t('settings.model.checkOk', { seconds })
    checkState.value = 'ok'
  } catch (error) {
    // текст ошибки собирает describeError: он уже называет причину и куда лезть
    checkMessage.value = error instanceof Error ? error.message : t('errors.llmUnknown')
    checkState.value = 'fail'
  }
}
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-6">
    <div class="flex flex-col gap-2">
      <h2 class="m-0 text-2xl font-semibold">
        {{ t('settings.model.title') }}
      </h2>
      <p class="m-0 text-muted">
        {{ t('settings.model.subtitle') }}
      </p>
    </div>

    <SectionPanel>
      <!-- пресеты выше полей: сначала берут готовое, потом правят руками -->
      <div class="flex flex-col gap-2">
        <span class="text-muted">{{ t('settings.model.presets') }}</span>
        <div class="flex flex-wrap gap-2">
          <Button
            :label="t('settings.model.localPreset')"
            severity="secondary"
            size="small"
            @click="applyLocalPreset"
          />
          <Button
            :label="t(HAS_DEV_YANDEX_CREDENTIALS ? 'settings.model.yandexPresetDev' : 'settings.model.yandexPreset')"
            severity="secondary"
            size="small"
            @click="applyYandexPreset"
          />
          <Button
            v-for="preset in OPENAI_COMPATIBLE_PRESETS"
            :key="preset.title"
            :label="preset.title"
            severity="secondary"
            size="small"
            @click="applyCompatiblePreset(preset)"
          />
        </div>
      </div>

      <FormField
        :label="t('settings.model.provider')"
        input-id="llm-provider"
      >
        <Select
          id="llm-provider"
          :model-value="settings.provider"
          :options="providerOptions"
          option-label="title"
          option-value="id"
          class="w-full sm:w-64"
          @update:model-value="applyProvider"
        />
        <template
          v-if="providerKeyUrl"
          #hint
        >
          {{ t('settings.model.keyHintBefore') }}
          <a
            :href="providerKeyUrl"
            target="_blank"
            rel="noreferrer noopener"
            class="inline-flex items-center gap-1 underline underline-offset-2"
          >{{ t('settings.model.keyHintLink') }}<ExternalLink :size="12" /></a>.
        </template>
      </FormField>

      <FormField
        :label="t('settings.model.baseUrl')"
        input-id="llm-base-url"
      >
        <InputText
          id="llm-base-url"
          v-model="settings.baseUrl"
          placeholder="http://localhost:1234"
        />
        <HostAccess :urls="[settings.baseUrl]" />
      </FormField>

      <FormField
        :label="t('settings.model.model')"
        input-id="llm-model"
        :hint="settings.provider === 'openai' ? t('settings.model.modelHint') : undefined"
      >
        <InputText
          id="llm-model"
          v-model="settings.model"
          placeholder="gpt-oss"
        />
      </FormField>

      <FormField
        :label="t('settings.model.apiKey')"
        input-id="llm-key"
      >
        <!-- toggle-mask: ключ вставляют из консоли провайдера, вслепую опечатку не поймать -->
        <Password
          v-model="settings.apiKey"
          input-id="llm-key"
          toggle-mask
          :feedback="false"
          fluid
          :input-props="{ autocomplete: 'off' }"
          :placeholder="t('settings.model.apiKeyPlaceholder')"
        />
      </FormField>
    </SectionPanel>

    <!-- картинка держит статус связи: пока всё настроено — ядро горит, при
         провале проверки или пустом адресе линия рвётся -->
    <SectionPanel class="flex-row flex-wrap items-center gap-x-6 gap-y-3">
      <InlineSvg
        :markup="isLinked ? modelArt : modelOfflineArt"
        class="w-32 text-content"
      />

      <div class="flex min-w-56 flex-1 flex-col gap-2">
        <div>
          <Button
            :label="checkState === 'busy' ? t('settings.model.checkBusy') : t('settings.model.check')"
            severity="secondary"
            outlined
            :disabled="checkState === 'busy'"
            @click="runCheck"
          >
            <template
              v-if="checkState === 'busy'"
              #icon
            >
              <!-- спиннер PrimeVue — иконочный шрифт, которого в проекте нет: крутим свою иконку -->
              <AppLoader :size="16" />
            </template>
          </Button>
        </div>
        <Message
          v-if="checkState === 'ok' || checkState === 'fail'"
          :severity="checkState === 'ok' ? 'success' : 'error'"
          size="small"
          variant="simple"
        >
          {{ checkMessage }}
        </Message>
        <small class="text-muted">
          {{ t('settings.model.checkHint') }}
        </small>
      </div>
    </SectionPanel>
  </div>
</template>
