<script setup lang="ts">
import type { Order } from '@/shared/model/order';

const props = defineProps<{ order: Order; }>();
</script>

<template>
  <div class="flex p-4 bg-white/90">
    <div class="flex flex-col">
      <span>discount: {{ props.order.totals.discountAmount }}</span>
    </div>

    <div class="flex flex-col items-end ml-auto">
      <span class="text-sm text-surface">subtotal: {{ props.order.totals.subTotal }}</span>
      <span class="text-2xl font-semibold">total: {{ props.order.totals.finalTotal }}</span>
    </div>
  </div>
</template>
