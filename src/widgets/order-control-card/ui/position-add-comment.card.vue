<script setup lang="ts">
import type { OrderPosition } from '@/shared/model/order';
import { AppBtn, CardMain } from '@/shared/ui';
import { ref } from 'vue';

type PositionAddCommmentCardProps = {
  position: OrderPosition;
};

const props = defineProps<PositionAddCommmentCardProps>();
const emit = defineEmits<{ (e: 'save', position: OrderPosition): void; (e: 'cancel'): void; }>();

const comment = ref(props.position.description || '');

const saveComment = () => {
  const updatedPosition = { ...props.position, description: comment.value };
  emit('save', updatedPosition);
};
</script>

<template>
  <form @submit.prevent="saveComment">
    <CardMain class="bg-info w-90">
      <textarea
        v-model="comment"
        rows="4"
        class="p-2 rounded-lg bg-white"
        placeholder="Введите комментарий..."
      ></textarea>

      <template v-slot:action>
        <AppBtn
          @click="emit('cancel')"
          color="error"
          text="Отмена"
        />
        <AppBtn
          type="submit"
          text="Добавить"
        />
      </template>
    </CardMain>
  </form>
</template>
