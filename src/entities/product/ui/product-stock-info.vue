<script setup lang="ts">
withDefaults(defineProps<{
  quantity?: number;
  label?: string;
  warning?: boolean;
}>(), {
  label: 'Остаток',
  warning: false,
});
</script>

<template>
  <span
    v-if="quantity !== undefined"
    class="text-sm font-bold"
    :class="warning ? 'text-red-700' : 'text-white'"
  >
    {{ label }}: {{ quantity }} шт
  </span>
</template>
