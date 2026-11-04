<script setup lang="ts">
import FlexCol from '../flex.col.vue';
import NotificationItem from './notification.item.vue';
import { useNotificationStore } from './notification.store.ts';

const notificationStore = useNotificationStore();
</script>

<template>
  <FlexCol
    :gap="4"
    class="items-center mb-8"
  >
    <NotificationItem
      v-for="notification in notificationStore.notificaions"
      :notification="notification"
    />
  </FlexCol>
</template>
