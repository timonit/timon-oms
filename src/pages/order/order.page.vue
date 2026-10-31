<script setup lang="ts">
import { productToPosition, useOrderStore } from '@/entities/order';
import { ProductsGrid, useProductStore } from '@/entities/product';
import { changeOrderPositions } from '@/feature/change-order-positions';
import { openOrder } from '@/feature/open-order';
import type { Order } from '@/shared/model/order';
import type { Product } from '@/shared/model/product';
import { AppBtn } from '@/shared/ui';
import { OrderControlCard } from '@/widgets/order-control-card';
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const productStore = useProductStore();
const orderStore = useOrderStore();

const selected = ref<string[]>([]);
const order = ref<Order | undefined>();
const status = ref<string | undefined>();

const pickProducts = async (product: Product) => {
  if (order.value) {
    const positions = [...order.value.positions, productToPosition(product, order.value.positions.length)];
    order.value = await changeOrderPositions({ id: order.value.id, positions });
  }
};

const addOrder = async () => {
  if (order.value) {
    order.value = undefined;
    selected.value = [];
  }
  const newOrder = await openOrder({
    positions: []
  });

  router.push({ name: 'Order', params: { id: newOrder.id } });
};

const syncData = (id?: string | string[]) => {
  if (id && typeof id === 'string') {
    const foundOrder = orderStore.getOrderWithID(id);
    if (foundOrder) {
      order.value = foundOrder;
      selected.value = foundOrder.positions.map((o) => o.name);
    }
    else status.value = `not found order with id ${id}`;
  } else {
    order.value = undefined;
    selected.value = [];
  }
};

watch(
  () => route.params.id,
  (id) => syncData(id),
  { immediate: true }
);
</script>

<template>
  <div class="flex gap-4 items-center mb-2">
    <AppBtn
      text="Открыть заказ"
      @click="addOrder"
    />

    <span v-if="status">{{ status }}</span>
  </div>

  <div
    v-if="order"
    class="flex gap-4 flex-col lg:flex-row"
  >
    <div class="grow-0 shrink-0 lg:w-4/7">
      <OrderControlCard v-model="order" />
    </div>

    <ProductsGrid
      :products="productStore.products"
      class="grow shrink"
      @pick="pickProducts"
    />
  </div>
</template>
