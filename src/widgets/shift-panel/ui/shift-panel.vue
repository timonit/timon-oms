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
  await closeShift();
  router.push({ name: 'OpenShift' });
};
</script>

<template>
  <div
    v-if="shiftStore.isOpenedShift"
    class="flex gap-4 items-center"
  >
    <div
      v-if="personal"
      class="text-white"
    >
      {{ personal }}
    </div>
    <AppBtn
      text="close shift"
      @click="closePersonalShift"
    />
  </div>
</template>
