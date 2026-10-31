<script setup lang="ts">
import type { Product } from '@/shared/model/product';
import { AppBtn, CardMain, FlexCol } from '@/shared/ui';
import { FormField, FormFieldAutocomplete } from '@/shared/ui/form';
import { computed } from 'vue';
import { useProductStore } from '../model';
import { useModificationStore } from '@/entities/modification';
import { useToggler } from '@/shared/composables';

const product = defineModel<Product>({ required: true });
const productStore = useProductStore();
const modificationStore = useModificationStore();

const types = computed(() => {
  return productStore.products.reduce((acc: string[], prod) => {
    if (acc.includes(prod.type)) return acc;
    return [...acc, prod.type];
  }, [] as string[]);
});

const { state: showModifSelect, toggle } = useToggler();
</script>

<template>
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
        label="Название"
        name="name"
        v-model="product.name"
        placeholder="name"
      />
      <FormField
        label="Цена"
        name="price"
        v-model="product.price"
        placeholder="price"
        type="number"
      />
      <FormFieldAutocomplete
        :id="product.name"
        label="Тип"
        name="type"
        v-model="product.type"
        placeholder="type"
        :list="types"
      />
      <FormField
        label="Штрихкод"
        name="ean"
        v-model="product.ean"
        placeholder="ean"
      />

      <FlexCol class="p-2 border border-white rounded-lg relative">
        <AppBtn
          :text="showModifSelect ? 'Скрыть' : 'Добавить'"
          color="secondary"
          @click="toggle"
          class="mb-4"
        />

        <select
          v-if="showModifSelect"
          v-model="product.availableModifications"
          placeholder="модификаторы"
          multiple
          class="bg-white"
        >
          <option
            v-for="modif in modificationStore.modifications"
            :key="modif.id"
            :value="modif.name"
            class="p-2"
          >
            {{ modif.name }}
          </option>
        </select>

        <ul
          v-else
          class="text-white"
        >
          <li
            v-for="modif of product.availableModifications"
            :key="modif"
            class="bg-white/10 p-2 my-1 rounded-lg mr-2"
          >
            {{ modif }}
          </li>
        </ul>
      </FlexCol>

    </FlexCol>

  </CardMain>
</template>
