<script setup lang="ts">
import { AppBtn, AppConfirmation, CardMain } from '@/shared/ui';
import { ORDER_STATUS, type Order, type OrderPosition } from '@/shared/model/order';
import OrderPositionRow from './order-position.row.vue';
import { FlexCol } from '@/shared/ui';
import OrderCalculatePanel from './order-calculate.panel.vue';
import { provide } from 'vue';
import { CloseOrderCard } from '@/feature/close-order';
import { useRouter } from 'vue-router';
import { ORDER_CONTROL_CARD_SERVICE_INJECT_KEY, OrderControlCardService } from '../model';
import { useToggler } from '@/shared/composables';
import AppModal from '@/shared/ui/app-modal.vue';
import PaymentPanel from './payment.panel.vue';
import { cancelOrder } from '@/feature/cancel-order/index.ts';

const order = defineModel<Order>({ required: true });
const router = useRouter();
const { state, enable, disable } = useToggler();
const {
  state: isShowCancelConfirmation,
  enable: showCancelConfirmation,
  disable: hideCancelConfirmation,
} = useToggler();
const orderControlCardService = new OrderControlCardService(order);
provide(ORDER_CONTROL_CARD_SERVICE_INJECT_KEY, orderControlCardService);

const removePosition = (position: OrderPosition, index: number) => {
  orderControlCardService.changePositions(order.value.positions.filter((pos, i) => i !== index));
};

const goToNewOrder = async () => {
  router.push({ name: 'Order' });
};

const cancel = async () => {
  await cancelOrder(order.value);
  goToNewOrder();
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
        <span>позиции: {{ order.positions.length }}</span>
      </div>
    </template>

    <FlexCol :gap="4">
      <div class="flex flex-col gap-2">
        <OrderPositionRow
          v-for="(position, index) in order.positions"
          :key="position.name"
          :position="position"
          @remove="removePosition(position, index)"
        />
      </div>

      <hr class="border-white/50" />
      <OrderCalculatePanel :order="order" />

      <PaymentPanel
        v-if="order.status === ORDER_STATUS.closed"
        :order="order"
      />
    </FlexCol>

    <AppModal
      v-model="state"
      persistent
    >

      <CloseOrderCard
        :order="order"
        @closed="goToNewOrder"
      >
        <template v-slot:prepend>
          <div class="flex justify-end">
            <AppBtn
              text="X"
              @click="disable"
            />
          </div>
        </template>
      </CloseOrderCard>
    </AppModal>

    <AppConfirmation
      v-model="isShowCancelConfirmation"
      ok-btn-text="Отменить заказ"
      title="Вы уверены что хотите отменить заказ ?"
      @ok="cancel"
      close-after-ok
    />

    <template
      v-if="order.status !== ORDER_STATUS.closed"
      v-slot:action
    >
      <AppBtn
        text="Закрыть заказ"
        color="warning"
        @click="enable"
      />
      <AppBtn
        text="Отменить заказ"
        color="error"
        @click="showCancelConfirmation"
      />
    </template>
  </CardMain>
</template>
