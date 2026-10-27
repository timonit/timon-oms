<script setup lang="ts">
import { useShiftStore } from '@/entities/shift';
import type { Shift } from '@/shared/model/shift';
import { FlexCol } from '@/shared/ui';
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

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
  <div>
    <FlexCol
      v-if="shift"
      :gap="4"
    >
      <span>{{ shift.id }}</span>
      <span>{{ shift.personID }}</span>
      <span>{{ shift.status }}</span>
      <span>{{ shift.report }}</span>
      <span>opened at: {{ shift.openedAt.toLocaleString() }}</span>
      <span>closed at: {{ shift.closedAt?.toLocaleString() }}</span>
    </FlexCol>
  </div>
</template>
