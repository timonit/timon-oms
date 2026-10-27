<script setup lang="ts">
import { AppBtn, CardMain } from '@/shared/ui';
import type { Order, OrderPosition } from '@/shared/model/order';
import OrderPositionRow from './order-position.row.vue';
import { FlexCol } from '@/shared/ui';
import OrderCalculatePanel from './order-calculate.panel.vue';
import { watch } from 'vue';
import { closeOrder } from '@/feature/close-order/index.ts';
import { useRouter } from 'vue-router';
import { changeOrderPositions } from '@/feature/change-order-positions/index.ts';

const order = defineModel<Order>({ required: true });
const router = useRouter();

const removePosition = (position: OrderPosition, index: number) => {
  order.value.positions = order.value.positions.filter((pos, i) => i !== index);
};

watch(order.value, async (data) => {
  changeOrderPositions({ id: data.id, positions: data.positions });
});

const closeOrderCard = async () => {
  await closeOrder(order.value);
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
          @remove="removePosition(position, index)"
        />
      </div>

      <hr class="border-white/50" />
      <OrderCalculatePanel :order="order" />
    </FlexCol>

    <template v-slot:action>
      <AppBtn
        text="close order"
        @click="closeOrderCard"
      />
    </template>
  </CardMain>
</template>
