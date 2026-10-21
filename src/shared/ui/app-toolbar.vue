<script setup lang="ts">
type ActionBTN = {
  text: string;
  handler: () => void;
};

type AppToolbarProps = {
  actions: ActionBTN[];
};

const props = defineProps<AppToolbarProps>();
</script>

<template>
  <div class="flex w-full rounded-xl p-1 bg-surface gap-2">
    <div
      v-for="action in props.actions"
      :key="action.text"
      @click="action.handler"
      class="py-2 px-3 bg-surface-2 hover:bg-secondary hover:text-white rounded-lg cursor-pointer"
    >
      {{ action.text }}
    </div>
  </div>
</template>
