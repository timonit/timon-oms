<script setup lang="ts">
import { useProductStore, ProductForm, type Product } from '@/entities/product';
import { CreateProductForm } from '@/feature/create-product';
import { AppBtn, AppCollapse, AppToolbar } from '@/shared/ui';
import { ref } from 'vue';

const productStore = useProductStore();
const showCreateForm = ref(false);
const products = ref<Product[]>(productStore.products.map((prod) => ({ ...prod })));

productStore.$subscribe((mutation, state) => {
  if (!products.value.length && state.products.length) {
    products.value = state.products;
    return;
  }

  if (products.value.length !== state.products.length) {
    products.value = state.products.map<Product>((prod, index) => {
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
];
</script>

<template>
  <div class="p-4 flex flex-col gap-8">
    <AppToolbar :actions="toolbarActions" />
    <AppCollapse
      title="add product"
      v-model="showCreateForm"
      color="info"
    >
      <CreateProductForm />
    </AppCollapse>

    <div
      v-if="productStore.fetching"
      class="animate-ping bg-amber-400 size-4 rounded-full"
    ></div>
    <div
      v-else
      class="grid xs:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 items-start content-start"
    >
      <ProductForm
        v-for="(product, index) of products"
        :key="index"
        v-model="products[index]!"
      >
        <template v-slot:prepend>
          <AppBtn
            text="delete"
            @click="() => productStore.deleteProduct(product.id)"
          />
        </template>
      </ProductForm>
    </div>

  </div>
</template>
