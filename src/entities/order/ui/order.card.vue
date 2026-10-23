<script setup lang="ts">
import { AppModal, CardMain } from '@/shared/ui';
import type { Order } from '../model';
import OrderCardField from './order.card-field.vue';
import { useToggler } from '@/shared/composables';
import { removeOrder } from '@/feature/remove-order';
import AppBtn from '@/shared/ui/app-btn.vue';

type OrderCardProps = {
  order: Order;
};
const props = defineProps<OrderCardProps>();
const { state, enable, disable } = useToggler();

const date = new Date(props.order.createdAt).toLocaleString();
const positions = props.order.positions.map((pos) => pos.name).join(', ');
</script>

<template>
  <CardMain class="bg-info hover:bg-info/80">
    <div class="flex flex-col gap-4">
      <OrderCardField prop="order">
        <template v-slot:value>
          <RouterLink :to="{ name: 'Order', params: { id: order.id } }">order link</RouterLink>
        </template>
      </OrderCardField>

      <OrderCardField
        prop="index"
        :value="props.order.index"
      />

      <OrderCardField
        prop="status"
        :value="props.order.status"
      />

      <OrderCardField
        prop="positions"
        :value="positions"
      />

      <OrderCardField
        prop="createdAt"
        :value="date"
      />

    </div>

    <template v-slot:action>
      <AppBtn
        text="delete"
        @click.stop="enable"
      />
    </template>

    <AppModal v-model="state">
      <CardMain class="bg-error text-white w-75 shadow-xl">
        Confirmation delete order #{{ order.index }}

        <template v-slot:action>
          <div class="flex gap-2 justify-between w-full">
            <AppBtn
              text="cancel"
              @click="disable"
            />
            <AppBtn
              text="delete"
              @click="removeOrder(props.order.id)"
            />
          </div>
        </template>
      </CardMain>
    </AppModal>
  </CardMain>
</template>
