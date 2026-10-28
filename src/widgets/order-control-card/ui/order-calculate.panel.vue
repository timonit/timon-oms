<script setup lang="ts">
import type { Order } from '@/shared/model/order';

const props = defineProps<{ order: Order; }>();
</script>

<template>
  <div class="flex p-4 bg-white/90">
    <div class="flex flex-col">
      <span>Скидка: {{ props.order.totals.discountAmount }}</span>
    </div>

    <div class="flex flex-col items-end ml-auto">
      <span class="text-sm text-surface">Подытог: {{ props.order.totals.subTotal }}</span>
      <span class="text-2xl font-semibold">Итого: {{ props.order.totals.finalTotal }}</span>
    </div>
  </div>
</template>
