<script setup lang="ts">
import type { Order } from '@/shared/model/order';
import { FlexCol } from '@/shared/ui';

type OrderListCompactProps = {
  list: Order[];
};

const props = defineProps<OrderListCompactProps>();
</script>

<template>
  <FlexCol :gap="2">
    <div
      v-for="order in props.list"
      :key="order.id"
      class="flex justify-between gap-8 bg-info p-4 rounded-md"
    >
      <FlexCol>
        <span class="text-white">#{{ order.index }}</span>
        <span class="text-white text-sm">
          <span>
            Создан:
          </span>
          <span>
            {{ order.createdAt.toLocaleString() }}</span>
        </span>
        <span
          v-if="order.closedAt"
          class="text-white text-sm"
        >
          <span>
            Закрыт:
          </span>
          <span>
            {{ order.closedAt.toLocaleString() }}
          </span>
        </span>
      </FlexCol>
      <FlexCol>
        <span class="text-white">{{ order.totals.finalTotal }} ₸</span>
      </FlexCol>
    </div>
  </FlexCol>
</template>
