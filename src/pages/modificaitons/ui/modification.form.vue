<script setup lang="ts">
import { useModificationStore } from '@/entities/modification';
import type { Modification } from '@/shared/model/modification';
import { AppBtn, CardMain, FlexCol } from '@/shared/ui';
import FormField from '@/shared/ui/form/form.field.vue';
import { reactive, ref, useTemplateRef } from 'vue';

const emit = defineEmits<{ (e: 'added', modification: Modification): void; }>();
const modificationData = reactive({
  name: '',
  price: 0,
});
const modificationStore = useModificationStore();
const errors = ref();
const nameFieldEl = useTemplateRef('nameField');

const submit = async () => {
  try {
    const modif = {
      ...modificationData,
      id: crypto.randomUUID(),
    };
    await modificationStore.add(modif);
    emit('added', modif);

    modificationData.name = '';
    modificationData.price = 0;

    nameFieldEl.value?.$el.focus();
  } catch (err) {
    if (err instanceof Error) errors.value = err.message;
    else errors.value = err;
  }
};
</script>

<template>
  <form @submit.prevent="submit">
    <CardMain class="bg-info">
      <div
        v-if="errors"
        class="bg-red-800/50 border border-red-900 p-4 rounded-lg mb-8"
      >
        <span class="text-white text-sm">
          {{ errors }}
        </span>
      </div>

      <FlexCol :gap="4">
        <span class="text-white">
          Название
        </span>
        <FormField
          ref="nameField"
          v-model="modificationData.name"
          name="name"
        />

        <span class="text-white">
          Цена
        </span>
        <FormField
          v-model="modificationData.price"
          type="number"
          name="price"
        />
      </FlexCol>

      <template v-slot:action>
        <AppBtn
          text="Добавить"
          type="submit"
        />
      </template>
    </CardMain>
  </form>
</template>
