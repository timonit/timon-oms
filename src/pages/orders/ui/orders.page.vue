<script setup lang="ts">
import { OrderCard, useOrderStore } from '@/entities/order';
import { DefaultLayout } from '@/shared/ui/layouts';
// import { useRouter } from 'vue-router';

// const router = useRouter();
const orderStore = useOrderStore();

// const moveToOrder = (id: string) => {
//   router.push({ name: 'Order', params: { id } });
// };
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
        <!-- @click="moveToOrder(order.id)" -->
      </div>
    </div>
  </DefaultLayout>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fit, 350px);
}
</style>
