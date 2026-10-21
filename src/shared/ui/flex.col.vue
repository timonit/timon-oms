<script setup lang="ts">
type FlexColProps = {
  gap?: number;
};
const props = defineProps<FlexColProps>();
</script>

<template>
  <div
    class="flex flex-col"
    :style="{
      gap: `calc(var(--spacing) * ${props.gap})`
    }"
  >
    <slot />
  </div>
</template>
