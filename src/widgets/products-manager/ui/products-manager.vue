<script setup lang="ts">
import { useProductStore, ProductForm } from '@/entities/product';
import { CreateProductForm } from '@/feature/create-product';
import { useToggler } from '@/shared/composables';
import type { Product } from '@/shared/model/product';
import { AppBtn, AppCollapse, AppModal, AppToolbar, FlexCol } from '@/shared/ui';
import { computed, onMounted, ref } from 'vue';

const productStore = useProductStore();
const { state: showCreateForm, enable: showForm, disable: hideForm } = useToggler();
const products = ref<Product[]>(productStore.products.reverse().map((prod) => ({ ...prod })));

productStore.$subscribe((mutation, state) => {
  if (!products.value.length && state.products.length) {
    products.value = state.products.reverse();
    return;
  }

  if (products.value.length !== state.products.length) {
    products.value = state.products.reverse().map<Product>((prod, index) => {
      if (products.value[index]?.id === prod.id) {
        return products.value[index] as Product;
      }

      const localIndex = products.value.findIndex((p) => p.id === prod.id);
      if (localIndex > -1) return products.value[localIndex] as Product;

      return prod;
    });
  }
});

const toolbarActions = [
  {
    text: 'save',
    handler: () => productStore.setProducts(products.value),
  },
  {
    text: 'Добавить',
    handler: showForm,
  }
];



const currentType = ref<string>();

const types = computed(() => {
  return products.value.reduce<string[]>(
    (acc, prod) => {
      if (!acc.includes(prod.type)) return [...acc, prod.type];
      return acc;
    },
    [] as string[]
  );
});

const productsListActions = computed(() => {
  return [
    ...types.value.map((type) => ({
      text: type,
      handler: () => currentType.value = type,
      selected: currentType.value === type,
    })),
    {
      text: 'all',
      handler: () => currentType.value = 'all',
      selected: currentType.value === 'all',
    }
  ];
});

const productsByTypes = computed(() => {
  if (currentType.value === 'all') return products.value;
  return products.value.filter((p) => p.type === currentType.value);
});

onMounted(() => {
  if (types.value[0]) currentType.value = 'all';
});
</script>

<template>
  <div class="p-4 flex flex-col gap-8">
    <AppModal
      v-model="showCreateForm"
      persistent
    >
      <CreateProductForm
        @added="hideForm"
        @cancel="hideForm"
      />
    </AppModal>

    <FlexCol :gap="4">
      <AppToolbar :actions="toolbarActions" />

      <hr class="my-4 border-white" />

      <AppToolbar :actions="productsListActions" />
      <div
        v-if="productStore.fetching"
        class="animate-ping bg-amber-400 size-4 rounded-full"
      ></div>

      <div
        v-else
        class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start content-start"
      >
        <ProductForm
          v-for="(product, index) of productsByTypes"
          :key="index"
          v-model="productsByTypes[index]!"
          class="h-full"
        >
          <template v-slot:prepend>
            <AppBtn
              text="Удалить"
              color="error"
              @click="() => productStore.delete(product.id)"
            />
          </template>
        </ProductForm>
      </div>
    </FlexCol>

  </div>
</template>
