<script setup lang="ts">
import type { Order } from '@/shared/model/order';
import { PAY_METHOD, type Payment } from '@/shared/model/payment';
import { AppBtn } from '@/shared/ui';
import FlexCol from '@/shared/ui/flex.col.vue';
import { FormField } from '@/shared/ui/form';
import { useAttrs, watch } from 'vue';

const props = defineProps<{ order: Order; payments: Payment[]; index: number; }>();
const emit = defineEmits<{ (e: 'delete'): void; (e: 'change'): void; }>();
const paymentData = defineModel<Payment>({
  default: () => ({
    paymentMethod: PAY_METHOD.card,
    cash: null,
    cardOfBank: null,
    amount: 0,
    currency: 'tg'
  })
});

const getPaymentMethodTitle = (method: PAY_METHOD) => {
  switch (method) {
    case PAY_METHOD.card: return 'Карта';
    case PAY_METHOD.cash: return 'Наличные';
    default: return 'Не выбрано';
  }
};

const exactAmount = () => {
  let input = 0;

  props.payments.forEach((p, i) => {
    if (i === props.index) return;
    input += Number(p.amount);
  });

  const exact = props.order.totals.finalTotal - input;
  if (exact < 0) return;

  paymentData.value.amount = exact;
};

watch(paymentData.value, () => {
  emit('change');
});
</script>

<template>
  <div class="p-4 bg-success rounded-xl">
    <div class="flex justify-end gap-4 items-center mb-4">
      <span class="text-2xl text-white mr-auto">
        {{ getPaymentMethodTitle(paymentData.paymentMethod) }}
      </span>

      <AppBtn
        text="Точная сумма"
        color="secondary"
        @click="exactAmount"
      />
      <AppBtn
        text="Удалить"
        color="error"
        @click="emit('delete')"
      />
    </div>

    <FlexCol :gap="4">
      <select
        v-model="paymentData.paymentMethod"
        placeholder="Тип оплаты"
        class="bg-black/10 p-2 rounded-lg text-white"
      >
        <option
          v-for="method in PAY_METHOD"
          :key="method"
          :value="method"
          class="bg-black/50"
        >
          {{ getPaymentMethodTitle(method) }}
        </option>
      </select>

      <FormField
        v-model.number="paymentData.amount"
        type="number"
        placeholder="вносим"
      />
    </FlexCol>
  </div>
</template>
