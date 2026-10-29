<script setup lang="ts">
import { type Order } from '@/shared/model/order';
import { AppBtn, CardMain } from '@/shared/ui';
import FlexCol from '@/shared/ui/flex.col.vue';
import { computed, ref, watch } from 'vue';
import { closeOrder } from '../model';
import { PAY_METHOD, type Payment } from '@/shared/model/payment';
import PaymentForm from './payment.form.vue';
import { NotEnoughMoneyError } from '../errors/not-enough-money.error.ts';

type CloseOrderFormProps = {
  order: Order;
};

const props = defineProps<CloseOrderFormProps>();
const emit = defineEmits<{ (e: 'closed', order: Order): void; }>();
const payments = ref<Payment[]>([]);
const errors = ref<string | undefined>();

const paymentAmount = computed<number>(() => props.order.totals.finalTotal);

const addCashPayment = () => {
  const payment: Payment = {
    paymentMethod: PAY_METHOD.cash,
    cardOfBank: null,
    amount: 0,
    currency: 'tg',
  };

  payments.value = [...payments.value, payment];
};

const addCardPayment = () => {
  const payment: Payment = {
    paymentMethod: PAY_METHOD.card,
    cardOfBank: null,
    amount: 0,
    currency: 'tg',
  };

  payments.value = [...payments.value, payment];
};

const inputTotal = computed(() => {
  let input = 0;

  payments.value.forEach((p) => input += Number(p.amount));

  return input;
});

const diff = computed(() => inputTotal.value - paymentAmount.value);
const change = computed(() => diff.value < 0 ? 0 : diff.value);

const deletePayment = (index: number) => {
  payments.value = payments.value.filter((payment, i) => index !== i);
};

const close = async () => {
  try {
    const updatedOrder = await closeOrder({
      order: props.order,
      paymentData: {
        change: change.value,
        payments: payments.value,
      },
    });

    emit('closed', updatedOrder);
  } catch (err: unknown) {
    if (err instanceof NotEnoughMoneyError) errors.value = `Не хватаетaaa ${Math.abs(diff.value)}`;
    else throw err;
  }
};

watch(payments, () => {
  errors.value = undefined;
});
</script>

<template>
  <CardMain class="bg-info">
    <template v-slot:prepend>
      <slot name="prepend" />
    </template>

    <FlexCol :gap="4">
      <PaymentForm
        v-for="(payment, index) in payments"
        :key="index"
        :model-value="payment"
        :index="index"
        :order="order"
        :payments="payments"
        @delete="deletePayment(index)"
        @change="errors = undefined"
      />

      <FlexCol
        :gap="2"
        class=" p-4 rounded-lg font-black"
        :class="{
          'bg-error': !!errors,
          'bg-white': !errors
        }"
      >
        <span>
          Внесено {{ inputTotal }} тг
        </span>
        <span class="text-info">
          Сдача {{ change }} тг
        </span>
        <span>
          К оплате {{ paymentAmount }} тг
        </span>
        <span
          v-if="diff < 0"
          :class="{ 'text-error': !errors, 'text-white': errors, }"
        >
          Не хватает {{ Math.abs(diff) }} тг
        </span>
      </FlexCol>

      <div class="flex justify-between gap-8 mt-4 w-100">
        <AppBtn
          text="оплата картой"
          @click="addCardPayment"
        />
        <AppBtn
          text="оплата наличными"
          @click="addCashPayment"
        />
      </div>
      <div class="flex justify-end gap-8 mt-4 w-100">
        <AppBtn
          text="Закрыть заказ"
          @click="close"
        />
      </div>
    </FlexCol>
  </CardMain>
</template>
