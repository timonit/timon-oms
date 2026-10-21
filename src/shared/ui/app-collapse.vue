<script setup lang="ts">
import { useToggler } from '../composables';

type AppCollapseProps = {
  title?: string;
  color?: string;
};
const props = defineProps<AppCollapseProps>();
const model = defineModel<boolean>({ default: false });
const { toggle } = useToggler(model);
</script>

<template>
  <div>
    <div
      @click="toggle"
      class="text-center rounded-lg p-2 cursor-pointer text-white uppercase select-none"
      :class="{
        [`bg-${props.color}`]: true,
      }"
    >
      <slot name="title">
        {{ $props.title }}
      </slot>
    </div>

    <div
      v-show="model"
      class="mt-4"
    >
      <slot />
    </div>
  </div>
</template>
