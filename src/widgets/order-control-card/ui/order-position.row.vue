<script setup lang="ts">
import type { OrderPosition } from '@/entities/order';
import { useToggler } from '@/shared/composables';
import { AppBtn, AppModal, CardMain } from '@/shared/ui';
import ChangeTags from './change-tags.vue';

const emit = defineEmits<{ (e: 'remove'): void; }>();
const position = defineModel<OrderPosition>({ required: true });

const increment = () => position.value.quantity += 1;
const decrement = () => {
  if (position.value.quantity < 2) return;
  position.value.quantity -= 1;
};
const { state, enable, disable } = useToggler();
</script>

<template>
  <div class="flex flex-col">
    <div class="flex items-center gap-4 p-2 pl-4 bg-secondary text-white rounded-xl">
      <div class="w-1/3">
        {{ position.name }}
      </div>

      <div class="w-1/3">
        <AppBtn
          text="tags"
          @click="enable"
        />
        <AppModal v-model="state">
          <ChangeTags />
        </AppModal>
      </div>

      <div class="flex-nowrap flex items-center gap-2 w-1/3">
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

    <div v-if="position.tags.length">
      <span>
        tags:
      </span>
      <span>
        {{ position.tags }}
      </span>
    </div>

    <div v-if="position.description">
      {{ position.description }}
    </div>
  </div>
</template>
