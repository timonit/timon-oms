<script setup lang="ts">
import { computed } from 'vue';
import type { NotificationDTO } from './notification.dto';

type NotificationItemProps = {
  notification: NotificationDTO;
};

const props = defineProps<NotificationItemProps>();

let styles = getComputedStyle(document.documentElement);
let color = computed(() => styles.getPropertyValue(`--color-${props.notification.type}`));
</script>

<template>
  <div
    class="flex flex-col gap-2 p-4 rounded-2xl shadow-lg"
    :style="`--bg-color: ${color}`"
    :class="`bg-(--bg-color) hover:bg-(--bg-color)/60`"
  >
    <div v-if="props.notification.title">
      <span class="text-lg font-bold text-white text-wrap">
        {{ props.notification.title }}
      </span>
    </div>
    <div
      v-if="props.notification.title"
      class="text-wrap"
    >
      {{ props.notification.content }}
    </div>
  </div>
</template>
