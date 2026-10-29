<script setup lang="ts">
import type { OrderPosition } from '@/shared/model/order';
import { useToggler } from '@/shared/composables';
import { AppBtn, AppModal } from '@/shared/ui';
import { ModificationList } from './modifications';
import { ModificationChip } from '@/entities/modification';
import { calculatePositionTotalPrice } from '@/entities/order';
import { inject } from 'vue';
import { ORDER_CONTROL_CARD_SERVICE_INJECT_KEY } from '../model';

const emit = defineEmits<{ (e: 'remove'): void; }>();
const props = defineProps<{ position: OrderPosition; }>();
const orderControlCardService = inject(ORDER_CONTROL_CARD_SERVICE_INJECT_KEY);
if (!orderControlCardService) throw new Error('orderControlCardService not found');

const increment = () => {
  const updatedPosition = {
    ...props.position,
    quantity: props.position.quantity + 1,
  };

  orderControlCardService.changePosition({
    ...updatedPosition,
    totalPrice: calculatePositionTotalPrice(updatedPosition),
  });
};

const decrement = () => {
  if (props.position.quantity < 2) return;

  const updatedPosition = {
    ...props.position,
    quantity: props.position.quantity - 1,
  };

  orderControlCardService.changePosition({
    ...updatedPosition,
    totalPrice: calculatePositionTotalPrice(updatedPosition),
  });
};
const { state, enable, disable } = useToggler();

const changeModifications = (modifications: string[]) => {
  const updatedPosition = { ...props.position, modifications };
  orderControlCardService.changePosition({ ...updatedPosition, totalPrice: calculatePositionTotalPrice(updatedPosition) });
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between gap-4 p-2 pl-4 bg-secondary text-white rounded-xl relative z-10">
      <div class="shrink-0 w-1/3">
        {{ position.name }}
      </div>

      <div class="grow-0 shrink-0">
        <AppBtn
          text="модиф"
          @click="enable"
        />
        <AppModal v-model="state">
          <ModificationList
            :position="position"
            with-close-btn
            :model-value="position.modifications"
            @update:model-value="changeModifications"
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
            text="удалить"
            color="error"
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
        Модификаторы:
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
