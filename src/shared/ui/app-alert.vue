<script setup lang="ts">
type AppAlertProps = {
  title?: string;
  content?: string;
};

const props = defineProps<AppAlertProps>();
</script>

<template>
  <div class="flex flex-col p-4 rounded-lg">
    <div v-if="props.title || $slots.title">
      <slot name="title">
        <span class="text-xl text-wrap">
          {{ props.title }}
        </span>
      </slot>
    </div>

    <div
      v-if="props.content || $slots.default"
      class="alert-content"
    >
      <slot>
        <span class="text-wrap">
          {{ props.content }}
        </span>
      </slot>
    </div>
  </div>
</template>
