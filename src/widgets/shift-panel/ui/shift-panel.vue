<script setup lang="ts">
import { computed } from 'vue';
import { useShiftStore } from '@/entities/shift/index.ts';
import { AppBtn } from '@/shared/ui';

const shiftStore = useShiftStore();

const personal = computed(() => {
  return shiftStore.person;
});
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
