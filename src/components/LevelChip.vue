<script setup lang="ts">
import type { CefrLevel } from '@/types/words'

/** Уровень CEFR у слова — один вид на панель, словарь, карточку и тренировку */
defineProps<{ level: CefrLevel }>()
</script>

<template>
  <span class="rounded bg-surface-hover px-1.5 py-0.5 text-[11px] font-medium text-muted">
    {{ level }}
  </span>
</template>
