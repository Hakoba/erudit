<script setup lang="ts">
import { computed } from 'vue'

/** Строка сводки: подпись, полоска относительно максимума и число. Долю и максимум считает вызывающий */
const props = withDefaults(
  defineProps<{
    label: string
    value: number
    max: number
    /** Доля от целого — подписью справа, если есть смысл её показывать */
    share?: number
    colorClass?: string
  }>(),
  { share: undefined, colorClass: 'bg-brand' },
)

const width = computed<string>(() => `${props.max ? (props.value / props.max) * 100 : 0}%`)
const shareLabel = computed<string>(() => (props.share === undefined ? '' : `${Math.round(props.share * 100)}%`))
</script>

<template>
  <li class="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1">
    <span
      class="truncate"
      :title="label"
    >
      {{ label }}
    </span>
    <span class="text-right text-sm text-muted tabular-nums">
      {{ value }}<template v-if="shareLabel"> · {{ shareLabel }}</template>
    </span>
    <span class="col-span-2 h-1.5 overflow-hidden rounded-full bg-line/40">
      <span
        class="block h-full rounded-full"
        :class="colorClass"
        :style="{ width }"
      />
    </span>
  </li>
</template>
