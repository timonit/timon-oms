<script setup lang="ts">
import type { Order, OrderPayment } from '@/shared/model/order';
import FlexCol from '@/shared/ui/flex.col.vue';

const props = defineProps<{ order: Order; }>();
const paymentData = props.order.payment as OrderPayment;
const paymentMethodText = {
  'cash': 'Наличные',
  'card': 'Карта',
};
</script>

<template>
  <FlexCol
    :gap="4"
    class="p-4 bg-warning"
  >
    <div
      v-for="(payment, index) of paymentData.payments"
      :key="index"
      class="p-2 bg-white"
    >
      <div>
        <span>Внесено: </span>
        <span>{{ payment.amount }} ₸</span>
      </div>

      <div>
        <span>Способ оплаты: </span>
        <span>{{ paymentMethodText[payment.paymentMethod] }}</span>
      </div>

      <div>
        <span>Сдача: </span>
        <span>{{ paymentData.change }} ₸</span>
      </div>
    </div>

  </FlexCol>
</template>
