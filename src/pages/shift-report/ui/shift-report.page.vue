<script setup lang="ts">
import { useShiftStore } from '@/entities/shift';
import type { Shift } from '@/shared/model/shift';
import { AppBtn, CardMain, FlexCol } from '@/shared/ui';
import FieldRow from '@/shared/ui/field.row.vue';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { clearAllStores } from '../model';

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
          fieldName="personal"
          :fieldValue="shift.personID"
        />
        <FieldRow
          fieldName="status"
          :fieldValue="shift.status"
        />
        <FlexCol
          :gap="2"
          class="bg-info p-2"
        >
          <span class="text-white">Report:</span>
          <div class="flex flex-col items-start">
            <FieldRow
              class="bg-transparent"
              fieldName="total profit"
              :fieldValue="shift.report.totalProfit"
            />
            <FieldRow
              class="bg-transparent"
              fieldName="total orders"
              :fieldValue="shift.report.orders.length"
            />
          </div>
        </FlexCol>
        <!-- <FieldRow
          fieldName="report"
          :fieldValue="shift.report"
        /> -->
        <FieldRow
          fieldName="Opened at"
          :fieldValue="shift.openedAt.toLocaleString()"
        />
        <FieldRow
          v-if="shift.closedAt"
          fieldName="Closed at"
          :fieldValue="shift.closedAt.toLocaleString()"
        />
      </FlexCol>
    </CardMain>

    <div class="fixed bottom-0 left-0 p-4">
      <AppBtn
        text="reset all store"
        @click="clearAllStores"
      />
    </div>
  </div>
</template>
