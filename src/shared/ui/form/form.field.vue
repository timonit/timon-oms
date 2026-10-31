<script setup lang="ts">
import FlexCol from '../flex.col.vue';

const props = defineProps<{ label?: string; }>();
const model = defineModel();
</script>

<template>
  <FlexCol>
    <label
      v-if="props.label"
      class="text-white text-xs"
    >{{ label }}</label>
    <input
      class="rounded-lg p-2 bg-white/80"
      v-model="model"
    />
  </FlexCol>
</template>
