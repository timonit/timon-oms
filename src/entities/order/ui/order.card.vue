<script setup lang="ts">
import { AppModal, CardMain } from '@/shared/ui';
import type { Order } from '@/shared/model/order';
import OrderCardField from './order.card-field.vue';
import { useToggler } from '@/shared/composables';
import { removeOrder } from '@/feature/remove-order';
import AppBtn from '@/shared/ui/app-btn.vue';
import { useRouter } from 'vue-router';

type OrderCardProps = {
  order: Order;
};
const props = defineProps<OrderCardProps>();
const router = useRouter();
const { state, enable, disable } = useToggler();

const date = new Date(props.order.createdAt).toLocaleString();
const positions = props.order.positions.map((pos) => pos.name).join(', ');
const moveToOrder = () => {
  router.push({ name: 'Order', params: { id: props.order.id } });
};
</script>

<template>
  <CardMain class="bg-info hover:bg-info/80">
    <div class="flex flex-col gap-4">

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
        text="move"
        color="secondary"
        @click.stop="moveToOrder"
      />
      <AppBtn
        text="delete"
        color="error"
        @click.stop="enable"
      />
    </template>

    <AppModal v-model="state">
      <CardMain class="bg-error text-white w-75 shadow-xl">
        <span>
          Confirmation delete order #{{ order.index }}
        </span>

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
