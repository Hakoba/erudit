<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import SectionPanel from '@/components/SectionPanel.vue'
import AccessSites from '@/components/accessSites.vue'

const { t } = useI18n()
</script>

<template>
  <div class="flex max-w-3xl flex-col gap-6">
    <h2 class="m-0 text-2xl font-semibold">
      {{ t('settings.sites.title') }}
    </h2>

    <SectionPanel>
      <AccessSites />
    </SectionPanel>
  </div>
</template>
