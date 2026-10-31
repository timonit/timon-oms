<script setup lang="ts">
import AppBtn from './app-btn.vue';

type ActionBTN = {
  text: string;
  handler: () => void;
  selected?: boolean;
};

type AppToolbarProps = {
  actions: ActionBTN[];
};

const props = defineProps<AppToolbarProps>();
</script>

<template>
  <div class="flex rounded-xl p-1 bg-surface gap-2 flex-wrap">
    <AppBtn
      v-for="action in props.actions"
      :key="action.text"
      @click="action.handler"
      class="py-2 px-3 rounded-lg cursor-pointer"
      :class="{
        'bg-success text-white': action.selected,
        ' bg-surface-2 hover:bg-secondary hover:text-white': !action.selected
      }"
    >
      {{ action.text }}
    </AppBtn>
  </div>
</template>
