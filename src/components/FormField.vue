<script setup lang="ts">
/**
 * Поле настроек: подпись над контролом и, если есть что сказать сверх подписи,
 * одна строка подсказки под ним. Подсказка — только факт, которого нет в подписи
 * (квота, формат ключа), а не пересказ того, что делает поле.
 */
defineProps<{
  label: string
  /** id контрола: подпись кликается и читается скринридером */
  inputId: string
  hint?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <label
      :for="inputId"
      class="text-muted"
    >
      {{ label }}
    </label>
    <slot />
    <small
      v-if="hint || $slots.hint"
      class="text-muted"
    >
      <slot name="hint">{{ hint }}</slot>
    </small>
  </div>
</template>
