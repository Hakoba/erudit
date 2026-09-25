<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import SectionPanel from '@/components/SectionPanel.vue'
import { ExternalLink } from 'lucide-vue-next'
import FormField from '@/components/FormField.vue'
import HostAccess from '@/components/HostAccess.vue'
import { useHostAccess } from '@/composables/useHostAccess'
import { credentialsFor } from '@/utils/mtClient'
import { useDictSettings } from '@/composables/useDictSettings'
import { YANDEX_LOOKUP_ORIGIN } from '@/utils/dictClient'
import type { Translator } from '@/utils/mt/translators'
import { TRANSLATOR_LIST, YANDEX_SOURCE, getTranslator } from '@/utils/mt/translators'
import type { TranslatorId } from '@/utils/mt/translators'

const { t } = useI18n()
const { settings } = useDictSettings()
const { requestAccess } = useHostAccess()

// computed
/**
 * Один список на все источники перевода. Яндекс.Словарь идёт первым — он знает
 * значения и транскрипцию, но только для одиночных слов; «не переводить» последним,
 * это отказ, а не источник.
 */
const translatorOptions = computed<{ id: string; title: string }[]>(() => [
  YANDEX_SOURCE,
  ...TRANSLATOR_LIST.map(({ id, title }) => ({ id, title })),
  { id: 'none', title: t('settings.dictionaries.translatorNone') },
])

const translator = computed<Translator | undefined>(() => getTranslator(settings.value.translator))

/** Адреса выбранного переводчика: у Lingva и LibreTranslate — из поля, у DeepL — по виду ключа */
const translatorUrls = computed<string[]>(() => {
  if (settings.value.translator === 'yandex') return [YANDEX_LOOKUP_ORIGIN]

  return translator.value ? translator.value.origins(credentialsFor(translator.value.id, settings.value)) : []
})

// методы
/** Выбор в списке — клик, и доступ к хосту переводчика спрашиваем сразу же */
function applyTranslator(id: TranslatorId): void {
  settings.value.translator = id
  void requestAccess(translatorUrls.value)
}
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-6">
    <h2 class="m-0 text-2xl font-semibold">
      {{ t('settings.dictionaries.title') }}
    </h2>

    <SectionPanel>
      <FormField
        :label="t('settings.dictionaries.translator')"
        input-id="translator"
        :hint="t('settings.dictionaries.translatorHint')"
      >
        <Select
          id="translator"
          :model-value="settings.translator"
          :options="translatorOptions"
          option-label="title"
          option-value="id"
          class="w-full sm:w-80"
          @update:model-value="applyTranslator"
        />
        <HostAccess :urls="translatorUrls" />
      </FormField>

      <Message
        v-if="translator?.unofficial"
        severity="warn"
        size="small"
        variant="simple"
      >
        {{ t('settings.dictionaries.unofficialHint', { title: translator.title }) }}
      </Message>

      <FormField
        v-if="settings.translator === 'yandex'"
        :label="t('settings.dictionaries.yandexKey')"
        input-id="dict-yandex-key"
        :hint="t('settings.dictionaries.yandexHint')"
      >
        <Password
          v-model="settings.yandexKey"
          input-id="dict-yandex-key"
          toggle-mask
          :feedback="false"
          fluid
          :input-props="{ autocomplete: 'off' }"
          placeholder="dict.1.1..."
        />
      </FormField>

      <FormField
        v-if="settings.translator === 'mymemory'"
        :label="t('settings.dictionaries.myMemoryEmail')"
        input-id="mymemory-email"
        :hint="t('settings.dictionaries.myMemoryHint')"
      >
        <InputText
          id="mymemory-email"
          v-model="settings.myMemoryEmail"
          type="email"
          autocomplete="off"
          placeholder="reader@example.com"
        />
      </FormField>

      <FormField
        v-if="settings.translator === 'lingva'"
        :label="t('settings.dictionaries.lingvaUrl')"
        input-id="lingva-url"
      >
        <InputText
          id="lingva-url"
          v-model="settings.lingvaUrl"
          placeholder="https://lingva.ml"
        />
        <template #hint>
          {{ t('settings.dictionaries.lingvaHint') }}
          <a
            href="https://github.com/thedaviddelta/lingva-translate#instances"
            target="_blank"
            rel="noreferrer noopener"
            class="inline-flex items-center gap-1 underline underline-offset-2"
          >github.com/thedaviddelta/lingva-translate<ExternalLink :size="12" /></a>.
        </template>
      </FormField>

      <template v-if="settings.translator === 'azure'">
        <FormField
          :label="t('settings.dictionaries.azureKey')"
          input-id="azure-key"
          :hint="t('settings.dictionaries.azureHint')"
        >
          <Password
            v-model="settings.azureKey"
            input-id="azure-key"
            toggle-mask
            :feedback="false"
            fluid
            :input-props="{ autocomplete: 'off' }"
          />
        </FormField>

        <FormField
          :label="t('settings.dictionaries.azureRegion')"
          input-id="azure-region"
          :hint="t('settings.dictionaries.azureRegionHint')"
        >
          <InputText
            id="azure-region"
            v-model="settings.azureRegion"
            placeholder="westeurope"
          />
        </FormField>
      </template>

      <FormField
        v-if="settings.translator === 'deepl'"
        :label="t('settings.dictionaries.deeplKey')"
        input-id="deepl-key"
      >
        <Password
          v-model="settings.deeplKey"
          input-id="deepl-key"
          toggle-mask
          :feedback="false"
          fluid
          :input-props="{ autocomplete: 'off' }"
          placeholder="xxxxxxxx-xxxx-…:fx"
        />
        <template #hint>
          {{ t('settings.dictionaries.deeplHint') }}
          <a
            href="https://www.deepl.com/pro-api"
            target="_blank"
            rel="noreferrer noopener"
            class="inline-flex items-center gap-1 underline underline-offset-2"
          >deepl.com/pro-api<ExternalLink :size="12" /></a>.
        </template>
      </FormField>

      <template v-if="settings.translator === 'libre'">
        <FormField
          :label="t('settings.dictionaries.libreUrl')"
          input-id="libre-url"
        >
          <InputText
            id="libre-url"
            v-model="settings.libreUrl"
            placeholder="https://libretranslate.com"
          />
        </FormField>

        <FormField
          :label="t('settings.dictionaries.libreKey')"
          input-id="libre-key"
        >
          <Password
            v-model="settings.libreKey"
            input-id="libre-key"
            toggle-mask
            :feedback="false"
            fluid
            :input-props="{ autocomplete: 'off' }"
            :placeholder="t('settings.dictionaries.libreKeyPlaceholder')"
          />
        </FormField>
      </template>

      <!-- толкования не выбираются: они бесплатны, ключа не просят и нужны только карточке -->
      <p class="m-0 text-muted">
        {{ t('settings.dictionaries.definitions') }}
      </p>
    </SectionPanel>
  </div>
</template>
