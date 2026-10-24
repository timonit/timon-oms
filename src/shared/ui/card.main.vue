<script setup lang="ts">
import { computed } from 'vue';
import type { UISize } from './types';

type CardMainProps = {
  rounded?: UISize;
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
    class="p-8 flex flex-col rounded-xl"
    :class="`${rounded} `"
  >
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
