<script setup lang="ts">
import type { OrderPosition } from '@/shared/model/order';
import { useToggler } from '@/shared/composables';
import { AppBtn, AppModal } from '@/shared/ui';
import { ModificationList } from './modifications';
import { ModificationChip, useModificationStore } from '@/entities/modification';
import { watch } from 'vue';
import { useProductStore } from '@/entities/product';

const emit = defineEmits<{ (e: 'remove'): void; }>();
const position = defineModel<OrderPosition>({ required: true });
const productStore = useProductStore();
const modificaitonStore = useModificationStore();

const increment = () => position.value.quantity += 1;
const decrement = () => {
  if (position.value.quantity < 2) return;
  position.value.quantity -= 1;
};
const { state, enable, disable } = useToggler();

watch(position.value, (pos) => {
  let totalPrice = 0;

  const product = productStore.getProductByName(pos.name);

  if (product) {
    totalPrice += Number(product.price) * Number(pos.quantity);
    const modifications = modificaitonStore.getModificationsByName(pos.modifications);
    modifications.forEach((m) => totalPrice += Number(m.price));
  }

  position.value.totalPrice = totalPrice;
});
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between gap-4 p-2 pl-4 bg-secondary text-white rounded-xl relative z-10">
      <div class="shrink-0 w-1/3">
        {{ position.name }}
      </div>

      <div class="grow-0 shrink-0">
        <AppBtn
          text="modif"
          @click="enable"
        />
        <AppModal v-model="state">
          <ModificationList
            :position="position"
            with-close-btn
            v-model="position.modifications"
            @close="disable"
          />
        </AppModal>
      </div>

      <div class="flex-nowrap flex items-center gap-2">
        <span>{{ position.totalPrice }}</span>
        <span class="text-nowrap">
          {{ position.quantity }} шт
        </span>
        <div class="flex gap-2">
          <AppBtn
            text="+"
            @click="increment"
          />
          <AppBtn
            text="-"
            @click="decrement"
          />
          <AppBtn
            text="delete"
            @click="() => emit('remove')"
          />
        </div>
      </div>
    </div>

    <div
      v-if="position.modifications.length"
      class="flex p-4 pb-2 gap-4 bg-secondary/60 relative -top-2 rounded-b-xl"
    >
      <span class="text-white">
        Modifications:
      </span>
      <div class="flex flex-wrap gap-4">
        <ModificationChip
          v-for="modification in position.modifications"
          :key="modification"
          :name="modification"
        />
      </div>
    </div>

    <div v-if="position.description">
      {{ position.description }}
    </div>
  </div>
</template>
