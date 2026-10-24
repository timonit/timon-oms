<script setup lang="ts">
import { AppBtn, CardMain } from '@/shared/ui';
import type { Order, OrderPosition } from '@/entities/order';
import OrderPositionRow from './order-position.row.vue';
import { changeOrder } from '@/feature/change-order';
import { FlexCol } from '@/shared/ui';
import OrderCalculatePanel from './order-calculate.panel.vue';
import { watch } from 'vue';
import { useProductStore } from '@/entities/product/index.ts';
import { useModificationStore } from '@/entities/modification/index.ts';
import { closeOrder } from '@/feature/close-order/index.ts';
import { useRouter } from 'vue-router';


const order = defineModel<Order>({ required: true });
const router = useRouter();
const productStore = useProductStore();
const modificationStore = useModificationStore();
const removePosition = (position: OrderPosition) => {
  order.value.positions = order.value.positions.filter((pos) => pos.name !== position.name);
};


const calculateTotals = () => {
  let totals: Order['totals'] = {
    subTotal: 0,
    deliveryFee: 0,
    discountAmount: 0,
    finalTotal: 0
  };

  order.value.positions.forEach((pos) => {
    const product = productStore.getProductByName(pos.name);
    if (!product) throw new Error('Product not found');

    totals.subTotal += (Number(product.price) * Number(pos.quantity));
    totals.finalTotal += (Number(product.price) * Number(pos.quantity));

    if (pos.modifications.length) {
      const modifications = modificationStore.getModificationsByName(pos.modifications);
      modifications.forEach((modif) => {
        totals.subTotal += Number(modif.price);
        totals.finalTotal += Number(modif.price);
      });
    }
  });

  return totals;
};

watch(order.value, (data) => {
  const newTotals = calculateTotals();
  order.value.totals.subTotal = newTotals.subTotal;
  order.value.totals.finalTotal = newTotals.finalTotal;
});

const closeOrderCard = () => {
  closeOrder(order.value);
  router.push({ name: 'Order' });
};
</script>

<template>
  <CardMain
    class="bg-info"
    :disabled="order.status === 'closed'"
  >
    <template v-slot:prepend>
      <div class="flex gap-4 justify-between text-white">
        <span>#{{ order.index }}</span>
        <span>{{ order.status }}</span>
        <span>positions: {{ order.positions.length }}</span>
      </div>
    </template>

    <FlexCol :gap="4">
      <div class="flex flex-col gap-2">
        <OrderPositionRow
          v-for="(position, index) in order.positions"
          :key="position.name"
          v-model="order.positions[index]"
          @remove="removePosition(position)"
        />
      </div>

      <hr class="border-white/50" />
      <OrderCalculatePanel :order="order" />
    </FlexCol>

    <template v-slot:action>
      <AppBtn
        text="save"
        @click="changeOrder(order)"
      />
      <AppBtn
        text="close order"
        @click="closeOrderCard"
      />
    </template>
  </CardMain>
</template>
