<script setup lang="ts">
import type { Product } from '@/shared/model/product/product.ts';
import ProductCard from './product.card.vue';

type ProductsGridProps = {
  products: Product[];
};

const props = defineProps<ProductsGridProps>();
const emit = defineEmits<{ (e: 'pick', product: Product): void; }>();

const pick = (product: Product) => {
  emit('pick', product);
};
</script>

<template>
  <div class="grid grid-cols-4 gap-2 items-start content-start w-fit">
    <ProductCard
      v-for="product in props.products"
      :product="product"
      @click="pick(product)"
      class="cursor-pointer"
    />
  </div>
</template>
