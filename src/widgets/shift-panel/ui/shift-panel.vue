<script setup lang="ts">
import { closeShift } from '@/feature/close-shift';
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { useShiftStore } from '@/entities/shift/index.ts';
import { AppBtn } from '@/shared/ui';

const router = useRouter();
const shiftStore = useShiftStore();

const personal = computed(() => {
  return shiftStore.person;
});


const closePersonalShift = async () => {
  const shiftID = shiftStore.shift ? shiftStore.shift.id : undefined;
  await closeShift();
  router.push({ name: 'ShiftReport', params: { id: shiftID } });
};
</script>

<template>
  <div class="flex gap-4 items-center">
    <div
      v-if="personal && shiftStore.isOpenedShift"
      class="text-white"
    >
      {{ personal }}
    </div>
    <RouterLink
      v-if="!shiftStore.isOpenedShift"
      :to="{ name: 'OpenShift' }"
    >
      <AppBtn text="Открыть смену" />
    </RouterLink>
  </div>
</template>
