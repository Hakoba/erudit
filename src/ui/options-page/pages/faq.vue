<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionPanel from '@/components/SectionPanel.vue'
import { ChevronDown } from 'lucide-vue-next'
import InlineSvg from '@/components/InlineSvg.vue'
import faqArt from '@/assets/illustrations/faq.svg?raw'

/**
 * Справка внутри расширения: короткие ответы на то, обо что спотыкаются на практике.
 * Исчерпывающая версия живёт в репозитории — держать её в шести локалях незачем,
 * поэтому рядом ссылка.
 *
 * Раскрытие — на нативном `details`: доступность и клавиатура достаются даром,
 * состояние хранить не нужно.
 */
const { t } = useI18n()

const FAQ_DOC_URL = `${__GITHUB_URL__}/blob/master/docs/FAQ.md`
const SETUP_DOC_URL = `${__GITHUB_URL__}/blob/master/docs/SETUP.md`
const SUPPORT_URL = 'https://t.me/erudit_extension'

/** Ключ вопроса даёт пару ключей локали: `<id>Q` и `<id>A` */
const GROUPS: { label: string; items: string[] }[] = [
  { label: 'start', items: ['free', 'silent', 'panel'] },
  { label: 'words', items: ['level', 'engine', 'translator', 'colors', 'simple'] },
  { label: 'page', items: ['area', 'reread', 'requests'] },
  { label: 'dictionary', items: ['repeat', 'sync', 'anki'] },
  { label: 'privacy', items: ['local', 'data'] },
]

const LINKS: { key: string; href: string }[] = [
  { key: 'faq.setupGuide', href: SETUP_DOC_URL },
  { key: 'faq.full', href: FAQ_DOC_URL },
  { key: 'faq.support', href: SUPPORT_URL },
]
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-6">
    <h2 class="m-0 text-2xl font-semibold">
      {{ t('faq.title') }}
    </h2>

    <!-- ссылки наверху, а не в конце: до конца ещё долистать -->
    <div class="flex flex-wrap items-center gap-x-6 gap-y-4">
      <InlineSvg
        :markup="faqArt"
        class="w-28 text-content"
      />
      <ul class="m-0 flex list-none flex-col gap-2 p-0">
        <li
          v-for="link in LINKS"
          :key="link.key"
        >
          <a
            :href="link.href"
            target="_blank"
            rel="noreferrer noopener"
            class="text-content underline decoration-line underline-offset-4 hover:decoration-current"
          >
            {{ t(link.key) }}
          </a>
        </li>
      </ul>
    </div>

    <SectionPanel
      v-for="group in GROUPS"
      :key="group.label"
      :title="t(`faq.group.${group.label}`)"
      class="gap-1"
    >
      <div class="divide-y divide-line">
        <details
          v-for="item in group.items"
          :key="item"
          class="group"
        >
          <summary
            class="flex cursor-pointer list-none items-center gap-3 py-3
                   [&::-webkit-details-marker]:hidden"
          >
            <span class="flex-1">{{ t(`faq.${item}Q`) }}</span>
            <ChevronDown
              :size="16"
              class="shrink-0 text-muted transition-transform group-open:rotate-180"
            />
          </summary>

          <p class="m-0 pb-4 text-muted">
            {{ t(`faq.${item}A`) }}
          </p>
        </details>
      </div>
    </SectionPanel>
  </div>
</template>
