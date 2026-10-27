<script setup lang="ts">
import type { Product } from '@/shared/model/product';
import { CardMain, FlexCol } from '@/shared/ui';
import { FormField, FormFieldAutocomplete } from '@/shared/ui/form';
import { computed } from 'vue';
import { useProductStore } from '../model';

const product = defineModel<Product>({ required: true });
const productStore = useProductStore();

const types = computed(() => {
  return productStore.products.reduce((acc: string[], prod) => {
    if (acc.includes(prod.type)) return acc;
    return [...acc, prod.type];
  }, [] as string[]);
});
</script>

<template>
  <form @submit.prevent>
    <CardMain class="bg-info">
      <template
        v-if="$slots.prepend"
        v-slot:prepend
      >
        <slot name="prepend" />
      </template>
      <span class="hidden">id: {{ product.id }}</span>

      <FlexCol :gap="4">
        <FormField
          name="name"
          v-model="product.name"
          placeholder="name"
        />
        <FormField
          name="price"
          v-model="product.price"
          placeholder="price"
        />
        <!-- <FormField
          name="type"
          v-model="product.type"
          placeholder="type"
        /> -->
        <FormFieldAutocomplete
          :id="product.name"
          name="type"
          v-model="product.type"
          placeholder="type"
          :list="types"
        />
        <FormField
          name="ean"
          v-model="product.ean"
          placeholder="ean"
        />
      </FlexCol>

    </CardMain>
  </form>
</template>
