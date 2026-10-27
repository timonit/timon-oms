<script setup lang="ts">
import { OrderCard, useOrderStore } from '@/entities/order';
import { useShiftStore } from '@/entities/shift';
import FlexCol from '@/shared/ui/flex.col.vue';
import { computed } from 'vue';

const orderStore = useOrderStore();
const shiftStore = useShiftStore();
const openedOrders = computed(() => {
  if (!shiftStore.shift) return orderStore.openedOrders;
  return orderStore.openedOrdersAfterDate(shiftStore.shift.openedAt);
});

const closedOrders = computed(() => {
  if (!shiftStore.shift) return orderStore.closedOrders;
  return orderStore.closedOrdersAfterDate(shiftStore.shift.openedAt);
});
</script>

<template>
  <FlexCol :gap="12">
    <span class="text-2xl font-bold text-white">Opened</span>
    <div class="gap-2 grid">
      <OrderCard
        v-for="order in openedOrders"
        :key="order.id"
        :order="order"
        class="cursor-pointer"
      />
    </div>
    <hr class="border-white" />
    <span class="text-2xl font-bold text-white">Closed</span>
    <div class="gap-2 grid">
      <OrderCard
        v-for="order in closedOrders"
        :key="order.id"
        :order="order"
        class="cursor-pointer"
      />
    </div>
  </FlexCol>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fit, 350px);
}
</style>
