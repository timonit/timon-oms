<script setup lang="ts">
import { computed } from 'vue';
import type { UISize } from './types';

type CardMainProps = {
  rounded?: UISize;
  disabled?: boolean;
};

const props = withDefaults(
  defineProps<CardMainProps>(),
  {
    rounded: 'xl'
  }
);

const rounded = computed(() => {
  return `rounded-${props.rounded}`;
});
</script>

<template>
  <div
    class="p-8 flex flex-col rounded-xl relative"
    :class="`${rounded}`"
  >
    <div
      v-if="props.disabled"
      class="absolute top-0 left-0 h-full bg-secondary/60 z-40"
      :class="`${rounded}`"
    ></div>
    <div
      v-if="$slots.prepend"
      class="mb-8"
    >
      <slot name="prepend" />
    </div>

    <slot />

    <div
      v-if="$slots.action"
      class="mt-8 flex justify-between"
    >
      <slot name="action" />
    </div>
  </div>
</template>
