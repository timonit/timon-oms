<script setup lang="ts">
import { useShiftStore } from '@/entities/shift';
import type { Shift } from '@/shared/model/shift';
import { AppBtn, CardMain, FlexCol } from '@/shared/ui';
import FieldRow from '@/shared/ui/field.row.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { clearAllStores } from '../model';
import { closeShift } from '@/feature/close-shift';

const route = useRoute();
let id = route.params.id;

const shiftStore = useShiftStore();
const shift = ref<Shift | undefined>();

onMounted(async () => {
  if (id && typeof id === 'string') shift.value = await shiftStore.getShift(id);
  else if (shiftStore.shift) {
    shift.value = shiftStore.shift;
  }
});

// @ts-ignore
window.clearStore = () => {
  clearAllStores();
};
</script>

<template>
  <div class="flex justify-center">
    <CardMain class="bg-white min-w-100 w-1/2">
      <template v-slot:prepend>
        <h1 class="text-2xl font-bold text-center">Отчет</h1>
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
          <span class="text-white">Отчет по заказам:</span>
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

      <template v-slot:action>
        <AppBtn
          v-if="shiftStore.shift"
          text="Закрыть смену"
          @click="closeShift"
        />
      </template>
    </CardMain>
  </div>
</template>
