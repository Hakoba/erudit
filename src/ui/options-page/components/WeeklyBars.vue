<script setup lang="ts">
import { computed } from 'vue'

/** Столбики по неделям: высота от максимума, число над столбиком. Подписи краёв даёт вызывающий */
const props = withDefaults(
  defineProps<{
    counts: number[]
    startLabel: string
    endLabel: string
    colorClass?: string
  }>(),
  { colorClass: 'bg-brand' },
)

const max = computed<number>(() => Math.max(...props.counts, 1))
</script>

<template>
  <div class="flex flex-col gap-1">
    <ul class="m-0 flex list-none items-end gap-1 p-0">
      <li
        v-for="(count, index) in counts"
        :key="index"
        class="flex flex-1 flex-col items-center gap-1"
      >
        <span class="text-xs text-muted tabular-nums">{{ count || '' }}</span>
        <span class="flex h-24 w-full items-end">
          <span
            class="block w-full rounded-t"
            :class="count ? colorClass : 'bg-line/40'"
            :style="{ height: count ? `${(count / max) * 100}%` : '2px' }"
          />
        </span>
      </li>
    </ul>
    <div class="flex justify-between text-xs text-muted">
      <span>{{ startLabel }}</span>
      <span>{{ endLabel }}</span>
    </div>
  </div>
</template>
