<script setup lang="ts">
import { computed } from 'vue';
import FlexCol from '../flex.col.vue';

const props = defineProps<{ label?: string; type?: string; name?: string; placeholder?: string; }>();
const model = defineModel<string | number | undefined>();
const inputValue = computed({
  get: () => model.value ?? '',
  set: (value: string | number) => {
    model.value = props.type === 'number' && value !== '' ? Number(value) : value;
  },
});
</script>

<template>
  <FlexCol>
    <label
      v-if="props.label"
      class="text-white text-xs"
    >{{ label }}</label>
    <input
      class="rounded-lg p-2 bg-white/80"
      :name="name"
      :type="type ?? 'text'"
      :placeholder="placeholder"
      v-model="inputValue"
    />
  </FlexCol>
</template>
