<script setup lang="ts">
import type { Product } from '@/entities/product/model/product.ts';
import ProductCard from './product.card.vue';

type ProductsGridProps = {
  products: Product[];
  selected?: string[];
};

const props = withDefaults(
  defineProps<ProductsGridProps>(),
  {
    selected: () => [],
  }
);

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
      :class="{ 'bg-amber-500': props.selected.includes(product.name) }"
    />
  </div>
</template>
