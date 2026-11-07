<script setup lang="ts">
import type { OrderPosition } from '@/shared/model/order';
import { useToggler } from '@/shared/composables';
import { AppBtn, AppModal, FlexCol } from '@/shared/ui';
import { ModificationList } from './modifications';
import { ModificationChip } from '@/entities/modification';
import { calculatePositionTotalPrice } from '@/entities/order';
import { inject } from 'vue';
import { ORDER_CONTROL_CARD_SERVICE_INJECT_KEY } from '../model';
import PositionAddCommentCard from './position-add-comment.card.vue';
import { computed } from 'vue';
import { useProductStore } from '@/entities/product';
import { ProductStockInfo } from '@/entities/product';

const emit = defineEmits<{ (e: 'remove'): void; }>();
const props = defineProps<{ position: OrderPosition; }>();
const orderControlCardService = inject(ORDER_CONTROL_CARD_SERVICE_INJECT_KEY);
if (!orderControlCardService) throw new Error('orderControlCardService not found');
const productStore = useProductStore();

const remainingStock = computed(() => {
  const product = productStore.getProductByName(props.position.name);
  if (product?.stock === undefined) return undefined;

  const orderedQuantity = orderControlCardService.order.value.positions
    .filter((position) => position.name === props.position.name)
    .reduce((total, position) => total + position.quantity, 0);

  return product.stock - orderedQuantity;
});

const isStockExceeded = computed(() => remainingStock.value !== undefined && remainingStock.value < 0);

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
const { state: ShowCommentModal, enable: enableCommentModal, disable: disableCommentModal } = useToggler();

const changeModifications = (modifications: string[]) => {
  const updatedPosition = { ...props.position, modifications };
  orderControlCardService.changePosition({ ...updatedPosition, totalPrice: calculatePositionTotalPrice(updatedPosition) });
};

const changePosition = (position: OrderPosition) => {
  orderControlCardService.changePosition({ ...position, totalPrice: calculatePositionTotalPrice(position) });
  disableCommentModal();
};
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between gap-4 p-2 pl-4 bg-secondary text-white rounded-xl relative z-10">
      <div class="shrink-0 w-1/5">
        {{ position.name }}
      </div>

      <ProductStockInfo
        v-if="isStockExceeded"
        :quantity="remainingStock"
        label="Остаток после заказа"
        warning
      />

      <div class="grow-0 shrink-0 flex gap-2">
        <AppBtn
          text="коммент"
          @click="enableCommentModal"
        />
        <AppBtn
          text="модиф"
          @click="enable"
        />
        <AppModal v-model="ShowCommentModal">
          <PositionAddCommentCard
            :position="position"
            @save="changePosition"
            @cancel="disableCommentModal"
          />
        </AppModal>
        <AppModal v-model="state">
          <ModificationList
            :position="position"
            with-close-btn
            :model-value="position.modifications"
            @update:model-value="changeModifications"
            @close="disable"
            only-pick
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

    <FlexCol
      v-if="position.modifications.length || position.description"
      :gap="4"
      class="p-4 bg-secondary/60 relative -top-2 rounded-b-xl"
    >
      <div
        v-if="position.modifications.length"
        class="flex gap-4"
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

      <hr
        v-if="position.modifications.length && position.description"
        class="border-black/20"
      />

      <div
        v-if="position.description"
        class="flex gap-4"
      >
        <span class="text-white">
          Комментарий:
        </span>
        <span class="text-white font-bold">
          {{ position.description }}
        </span>
      </div>
    </FlexCol>
  </div>
</template>
