<script setup lang="ts">
import { computed } from 'vue';
import type { UISize } from './types';

type BtnColor = 'bg' | 'surface' | 'surface-2' | 'success' | 'error' | 'warning' | 'info' | 'secondary';

type AppBtnProps = {
  text?: string;
  rounded?: UISize;
  color?: BtnColor;
};

const props = withDefaults(
  defineProps<AppBtnProps>(),
  {
    rounded: 'md',
    color: 'success',
  }
);

let styles = getComputedStyle(document.documentElement);
let color = computed(() => styles.getPropertyValue(`--color-${props.color}`));
</script>

<template>
  <button
    class="py-2 px-4 uppercase text-white cursor-pointer rounded-md"
    :style="`--bg-color: ${color}`"
    :class="`bg-(--bg-color) hover:bg-(--bg-color)/60`"
  >
    <slot>
      {{ props.text }}
    </slot>
  </button>
</template>
