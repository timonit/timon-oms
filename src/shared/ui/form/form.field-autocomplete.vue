<script setup lang="ts">
import { useToggler } from '@/shared/composables';
import AppDropdown from '../app-dropdown.vue';

const props = defineProps<{ list: string[]; }>();
const model = defineModel();

const { state, enable, disable } = useToggler();

const pick = (item: string) => {
  model.value = item;
};
</script>

<template>
  <div class="relative">
    <input
      class="rounded-lg p-2 bg-white/80 w-full"
      v-model="model"
      @focus="enable"
    />

    <AppDropdown
      v-model="state"
      :list="props.list"
      @pick="pick"
    />
  </div>
</template>
