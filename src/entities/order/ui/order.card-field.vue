<script setup lang="ts">
type OrderCardFieldProps = {
  prop?: string;
  value?: string | number;
};
const props = defineProps<OrderCardFieldProps>();
</script>

<template>
  <div class="flex justify-between gap-6 py-2 px-4 bg-secondary/20 text-white rounded-lg">
    <slot name="props">
      <span class="first-letter:uppercase">
        {{ props.prop }}:
      </span>
    </slot>
    <slot name="value">
      <span class="truncate">
        {{ props.value }}
      </span>
    </slot>
  </div>
</template>
