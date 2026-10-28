<script setup lang="ts">
import { AppBtn, CardMain, FlexCol } from '@/shared/ui';
import { FormField } from '@/shared/ui/form';
import { ref, useTemplateRef } from 'vue';
import { reactive } from 'vue';
import { createProduct, type CreateProductDTO } from '../model';
import type { Product } from '@/shared/model/product';

const emit = defineEmits<{ (e: "added", product: Product): void; }>();

const nameFieldEl = useTemplateRef('nameField');
const errors = ref();
const product: CreateProductDTO = reactive({
  name: '',
  price: 0,
  type: '',
  ean: undefined,
});

const add = async () => {
  try {
    const newProduct = await createProduct(product);
    emit('added', newProduct);

    product.name = '';
    product.price = 0;
    product.type = '';
    product.ean = '';

    nameFieldEl.value?.$el.focus();
  } catch (err) {
    if (err instanceof Error) errors.value = err.message;
    else errors.value = err;
  }
};
</script>

<template>
  <form @submit.prevent="add">
    <CardMain class="bg-info">
      <template v-slot:prepend>
        <h1 class="text-2xl font-bold text-center text-white">
          Добавление продукта
        </h1>
      </template>

      <div
        v-if="errors"
        class="bg-red-800/50 border border-red-900 p-4 rounded-lg mb-8"
      >
        <span class="text-white text-sm">
          {{ errors }}
        </span>
      </div>

      <FlexCol :gap="4">
        <span class="text-white">Название</span>
        <FormField
          ref="nameField"
          name="name"
          v-model="product.name"
          placeholder="Название продукта"
        />
        <span class="text-white">Цена</span>
        <FormField
          name="price"
          v-model="product.price"
          placeholder="Цена"
        />
        <span class="text-white">Тип продукта</span>
        <FormField
          name="type"
          v-model="product.type"
          placeholder="тип продукта (прим: Напитки, Фастфуд)"
        />
        <span class="text-white">Штрихкод</span>
        <FormField
          name="ean"
          v-model="product.ean"
          placeholder="штрихкод"
        />
      </FlexCol>

      <template v-slot:action>
        <AppBtn
          type="submit"
          text="Добавить"
        />
      </template>
    </CardMain>
  </form>
</template>
