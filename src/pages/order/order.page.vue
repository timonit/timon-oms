<script setup lang="ts">
import { productToPosition, useOrderStore, type Order } from '@/entities/order';
import { ProductsGrid, useProductStore, type Product } from '@/entities/product';
import { openOrder } from '@/feature/open-order';
import { AppBtn } from '@/shared/ui';
import { DefaultLayout } from '@/shared/ui/layouts';
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

const getPositions = () => {
  return selected.value.map((name) => {
    const product = productStore.getProductByName(name);
    if (!product) throw new Error('Product not found');

    return productToPosition(product);
  });
};

const pickProducts = async (product: Product) => {
  if (order.value) {
    const posFromOrder = order.value.positions.find((pos) => pos.name === product.name);
    if (posFromOrder) return;

    order.value.positions = [...order.value.positions, productToPosition(product)];
  }
};

const addOrder = async () => {
  if (order.value) {
    order.value = undefined;
    selected.value = [];
  }
  const newOrder = await openOrder({
    positions: getPositions()
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
  <DefaultLayout>
    <div class="flex gap-4 items-center mb-2">
      <AppBtn
        text="open order"
        @click="addOrder"
      />

      <span v-if="status">{{ status }}</span>
    </div>

    <div class="flex gap-4 w-full flex-col lg:flex-row">
      <div class="grow-0 shrink-0 lg:w-4/7">
        <OrderControlCard
          v-if="order"
          v-model="order"
        />
      </div>

      <ProductsGrid
        :products="productStore.products"
        class="grow-0 shrink-0  lg:w-3/7"
        @pick="pickProducts"
      />
    </div>
  </DefaultLayout>
</template>
