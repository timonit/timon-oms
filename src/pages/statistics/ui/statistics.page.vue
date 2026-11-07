<script setup lang="ts">
import { useShiftStore } from '@/entities/shift';
import type { Shift } from '@/shared/model/shift';
import { computed } from 'vue';

defineOptions({ name: 'StatisticsDashboardPage' });

const shiftStore = useShiftStore();

const sortedShifts = computed(() => {
  return [...shiftStore.shifts].sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime());
});

const closedShifts = computed(() => shiftStore.shifts.filter((shift) => shift.status === 'closed'));
const openedShifts = computed(() => shiftStore.shifts.filter((shift) => shift.status === 'opened'));
const totalRevenue = computed(() => shiftStore.shifts.reduce((sum, shift) => sum + shift.report.totalProfit, 0));
const totalOrders = computed(() => shiftStore.shifts.reduce((sum, shift) => sum + shift.report.orders.length, 0));
const averageClosedShiftRevenue = computed(() => {
  if (!closedShifts.value.length) return 0;
  return closedShifts.value.reduce((sum, shift) => sum + shift.report.totalProfit, 0) / closedShifts.value.length;
});

const formatDuration = (shift: Shift) => {
  if (!shift.closedAt) return 'Идёт';
  const totalMinutes = Math.max(0, Math.floor((shift.closedAt.getTime() - shift.openedAt.getTime()) / 60_000));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  if (days) return `${days} д ${hours} ч`;
  if (hours) return `${hours} ч ${minutes} мин`;
  return `${minutes} мин`;
};
</script>

<template>
  <section class="flex flex-col gap-6">
    <h1 class="text-2xl font-bold text-white">
      Статистика
    </h1>

    <section class="flex flex-col gap-4">
      <h2 class="text-xl font-bold text-white">
        Смены
      </h2>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div class="rounded-xl bg-info p-4 text-white">
          <div class="text-sm">Всего смен</div>
          <div class="text-2xl font-bold">{{ shiftStore.shifts.length }}</div>
        </div>
        <div class="rounded-xl bg-info p-4 text-white">
          <div class="text-sm">Закрытые</div>
          <div class="text-2xl font-bold">{{ closedShifts.length }}</div>
        </div>
        <div class="rounded-xl bg-info p-4 text-white">
          <div class="text-sm">Открытые</div>
          <div class="text-2xl font-bold">{{ openedShifts.length }}</div>
        </div>
        <div class="rounded-xl bg-info p-4 text-white">
          <div class="text-sm">Заказов</div>
          <div class="text-2xl font-bold">{{ totalOrders }}</div>
        </div>
        <div class="rounded-xl bg-info p-4 text-white">
          <div class="text-sm">Выручка за смены</div>
          <div class="text-2xl font-bold">{{ totalRevenue.toLocaleString() }} ₸</div>
          <div class="mt-1 text-sm">Средняя закрытая: {{ averageClosedShiftRevenue.toLocaleString() }} ₸</div>
        </div>
      </div>

      <div
        v-if="!sortedShifts.length"
        class="rounded-xl bg-info p-4 text-white"
      >
        Смен пока нет.
      </div>

      <div
        v-else
        class="overflow-x-auto rounded-xl bg-info"
      >
        <table class="w-full min-w-180 border-collapse text-left text-white">
          <thead>
            <tr class="border-b border-white/30">
              <th class="p-3">Начало</th>
              <th class="p-3">Сотрудник</th>
              <th class="p-3">Статус</th>
              <th class="p-3">Длительность</th>
              <th class="p-3">Заказов</th>
              <th class="p-3">Выручка</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="shift in sortedShifts"
              :key="shift.id"
              class="border-b border-white/15 last:border-0"
            >
              <td class="p-3">{{ shift.openedAt.toLocaleString() }}</td>
              <td class="p-3">{{ shift.personID }}</td>
              <td class="p-3">{{ shift.status === 'opened' ? 'Открыта' : 'Закрыта' }}</td>
              <td class="p-3">{{ formatDuration(shift) }}</td>
              <td class="p-3">{{ shift.report.orders.length }}</td>
              <td class="p-3">{{ shift.report.totalProfit.toLocaleString() }} ₸</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </section>
</template>
