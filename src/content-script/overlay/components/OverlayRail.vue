<script setup lang="ts">
import { RefreshCw, SquareDashedMousePointer } from 'lucide-vue-next'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import AppLoader from '@/components/AppLoader.vue'
import AppLogo from '@/components/AppLogo.vue'

defineProps<{
  wordsCount: number
  isLoading: boolean
  /** Разбор уже запускали: до первого раза перечитывать нечего */
  isStarted: boolean
  /** Идёт выбор области: на время него панель сворачивается сюда, отмена нужна и здесь */
  isPicking: boolean
}>()

const { t } = useI18n()

const emit = defineEmits<{
  (e: 'expand'): void
  (e: 'reread'): void
  (e: 'cancelPicking'): void
}>()
</script>

<template>
  <div class="flex flex-col items-center gap-2 py-3">
    <Button
      text
      rounded
      severity="secondary"
      size="small"
      :aria-label="t('overlay.expand')"
      :data-hint="t('overlay.expand')"
      @click="emit('expand')"
    >
      <AppLogo :size="18" />
    </Button>

    <!-- свёрнутая панель молчит, если не сказать, что разбор идёт; картинка
         декоративная, поэтому подпись висит на обёртке -->
    <span
      v-if="isLoading"
      role="status"
      class="flex text-muted"
      :aria-label="t('overlay.analyzing')"
    >
      <AppLoader :size="18" />
    </span>

    <span
      v-else-if="wordsCount"
      class="rounded bg-brand px-1.5 py-0.5 text-xs font-semibold text-[var(--p-primary-contrast-color)]"
      :aria-label="t('overlay.wordsFound')"
    >
      {{ wordsCount }}
    </span>

    <Button
      v-if="isPicking"
      text
      rounded
      severity="primary"
      size="small"
      :aria-label="t('overlay.pickAreaCancel')"
      :data-hint="t('overlay.pickAreaCancel')"
      @click="emit('cancelPicking')"
    >
      <SquareDashedMousePointer :size="16" />
    </Button>

    <Button
      v-else-if="isStarted && !isLoading"
      text
      rounded
      severity="secondary"
      size="small"
      :aria-label="t('overlay.reread')"
      :data-hint="t('overlay.rereadHint')"
      @click="emit('reread')"
    >
      <RefreshCw :size="16" />
    </Button>
  </div>
</template>
