<script setup lang="ts">
import { OrderCard, useOrderStore } from '@/entities/order';
import { DefaultLayout } from '@/shared/ui/layouts';

const orderStore = useOrderStore();
</script>

<template>
  <DefaultLayout>
    <div>
      <div class="gap-2 grid">
        <OrderCard
          v-for="order in orderStore.orders"
          :key="order.id"
          :order="order"
          class="cursor-pointer"
        />
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fit, 350px);
}
</style>
