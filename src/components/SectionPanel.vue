<script setup lang="ts">
/**
 * Секция страницы в рамке: без рамки в тёмной теме поля соседних секций сливаются
 * в одну колонку. Заголовок — только текст, без иконок и подзаголовков.
 */
defineProps<{ title?: string }>()
</script>

<template>
  <section class="flex flex-col gap-5 rounded-lg border border-line p-5">
    <h3
      v-if="title"
      class="m-0 text-base font-semibold"
    >
      {{ title }}
    </h3>
    <slot />
  </section>
</template>
