<script setup lang="ts">
import { OrderCard, useOrderStore } from '@/entities/order';
import FlexCol from '@/shared/ui/flex.col.vue';

const orderStore = useOrderStore();
</script>

<template>
  <FlexCol :gap="12">
    <span class="text-2xl font-bold text-white">Opened</span>
    <div class="gap-2 grid">
      <OrderCard
        v-for="order in orderStore.openedOrders"
        :key="order.id"
        :order="order"
        class="cursor-pointer"
      />
    </div>
    <hr class="border-white" />
    <span class="text-2xl font-bold text-white">Closed</span>
    <div class="gap-2 grid">
      <OrderCard
        v-for="order in orderStore.closedOrders"
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
