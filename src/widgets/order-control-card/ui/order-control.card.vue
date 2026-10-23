<script setup lang="ts">
import { AppBtn, CardMain } from '@/shared/ui';
import type { Order, OrderPosition } from '@/entities/order';
import OrderPositionRow from './order-position.row.vue';
import { changeOrder } from '@/feature/change-order';

const order = defineModel<Order>({ required: true });
const removePosition = (position: OrderPosition) => {
  order.value.positions = order.value.positions.filter((pos) => pos.name !== position.name);
};

const save = () => {
  changeOrder(order.value);
};
</script>

<template>
  <CardMain class="bg-info">
    <template v-slot:prepend>
      <div class="flex gap-4 justify-between text-white">
        <span>{{ order.index }}</span>
        <span>{{ order.status }}</span>
        <span>positions: {{ order.positions.length }}</span>
      </div>
    </template>

    <div class="flex flex-col gap-2">
      <OrderPositionRow
        v-for="(position, index) in order.positions"
        :key="position.name"
        v-model="order.positions[index]"
        @remove="removePosition(position)"
      />
    </div>

    <template v-slot:action>
      <AppBtn
        text="save"
        @click="save"
      />
    </template>
  </CardMain>
</template>
