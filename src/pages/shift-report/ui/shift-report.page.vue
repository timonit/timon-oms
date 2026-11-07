<script setup lang="ts">
import { useShiftStore } from '@/entities/shift';
import type { Shift } from '@/shared/model/shift';
import { CardMain, FlexCol } from '@/shared/ui';
import FieldRow from '@/shared/ui/field.row.vue';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { clearAllStores } from '../model';
import OrderListCompact from '@/entities/order/ui/order-list.compact.vue';
import { useOrderStore } from '@/entities/order';
import { useProductStore, ProductStockInfo } from '@/entities/product';

const route = useRoute();
const id = route.params.id;

const shiftStore = useShiftStore();
const orderStore = useOrderStore();
const productStore = useProductStore();
const shift = ref<Shift | undefined>();

onMounted(async () => {
  if (id && typeof id === 'string') shift.value = await shiftStore.getShift(id);
  else if (shiftStore.shift) {
    shift.value = shiftStore.shift;
  }
});

Object.assign(window, { clearAllStores });

const sort = ref<'createdAt' | 'closedAt' | 'finalTotal' | 'index'>('closedAt');

const sortOptions = [
  { value: 'createdAt', label: 'Дата создания' },
  { value: 'closedAt', label: 'Дата закрытия' },
  { value: 'finalTotal', label: 'Сумма заказа' },
  { value: 'index', label: 'Номер заказа' },
];

const orderList = computed(() => {
  if (!shift.value) return [];
  return orderStore.closedOrdersAfterDate(shift.value.openedAt);
});

const sortedList = computed(() => {
  switch (sort.value) {
    case 'createdAt':
      return [...orderList.value].sort((a, b) => (a.createdAt.getTime() - b.createdAt.getTime()));
    case 'closedAt':
      return [...orderList.value].sort((a, b) => (a.closedAt.getTime() - b.closedAt.getTime()));
    case 'finalTotal':
      return [...orderList.value].sort((a, b) => (a.totals.finalTotal - b.totals.finalTotal));
    case 'index':
      return [...orderList.value].sort((a, b) => (a.index - b.index));
    default:
      return [...orderList.value];
  }
});
</script>

<template>
  <div class="flex justify-center gap-4 flex-wrap">
    <CardMain class="bg-white min-w-100 w-1/2">
      <template v-slot:prepend>
        <h1 class="text-2xl font-bold text-center">
          Отчет
        </h1>
      </template>

      <FlexCol
        v-if="shift"
        :gap="4"
      >
        <FieldRow
          fieldName="id"
          :fieldValue="shift.id"
        />
        <FieldRow
          fieldName="Персонал"
          :fieldValue="shift.personID"
        />
        <FieldRow
          fieldName="Статус"
          :fieldValue="shift.status"
        />
        <FlexCol
          :gap="2"
          class="bg-info p-2"
        >
          <span class="text-white">
            Отчет по заказам:
          </span>
          <div class="flex flex-col items-start">
            <FieldRow
              class="bg-transparent"
              fieldName="Общая прибыль"
              :fieldValue="shift.report.totalProfit"
            />
            <FieldRow
              class="bg-transparent"
              fieldName="Всего заказов"
              :fieldValue="shift.report.orders.length"
            />
          </div>
        </FlexCol>
        <FlexCol
          :gap="2"
          class="bg-info p-2"
        >
          <span class="text-white">
            Остатки товаров:
          </span>
          <div
            v-if="productStore.products.some((product) => product.stock !== undefined)"
            class="flex flex-col items-start"
          >
            <div
              v-for="product in productStore.products.filter((item) => item.stock !== undefined)"
              :key="product.id"
              class="flex justify-between gap-4 w-full bg-transparent"
            >
              <span class="text-white">{{ product.name }}</span>
              <ProductStockInfo :quantity="product.stock" />
            </div>
          </div>
          <span
            v-else
            class="text-white"
          >
            Остатки не заданы
          </span>
        </FlexCol>
        <FieldRow
          fieldName="Открыл смену"
          :fieldValue="shift.openedAt.toLocaleString()"
        />
        <FieldRow
          v-if="shift.closedAt"
          fieldName="Закрыл смену"
          :fieldValue="shift.closedAt.toLocaleString()"
        />
      </FlexCol>

    </CardMain>

    <FlexCol :gap="4">
      <div class="flex justify-between items-center gap-4">
        <span class="text-white text-xl font-bold text-center">
          Заказы
        </span>
        <select
          v-model="sort"
          class="text-white bg-info p-2 rounded-md"
        >
          <option
            v-for="option in sortOptions"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </div>
      <OrderListCompact :list="sortedList" />
    </FlexCol>
  </div>
</template>
