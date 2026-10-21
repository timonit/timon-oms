<script setup lang="ts">
import type { UISize } from './types';

type AppBtnProps = {
  text?: string;
  rounded?: UISize;
};

const props = withDefaults(
  defineProps<AppBtnProps>(),
  {
    rounded: 'md',
  }
);
</script>

<template>
  <button class="py-2 px-4 uppercase bg-green-600 text-white cursor-pointer rounded-md">
    <slot>
      {{ props.text }}
    </slot>
  </button>
</template>
