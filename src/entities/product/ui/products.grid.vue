<script setup lang="ts">
import type { Product } from '@/entities/product/model/product.ts';
import ProductCard from './product.card.vue';

type ProductsGridProps = {
  products: Product[];
  selectable?: boolean;
};

const props = defineProps<ProductsGridProps>();
const selected = defineModel<string[]>({ default: () => [] });

const emit = defineEmits<{ (e: 'pick', product: Product): void; }>();

const pick = (product: Product) => {
  if (props.selectable) {
    if (selected.value.includes(product.name)) {
      selected.value = selected.value.filter((name) => name !== product.name);
    } else {
      selected.value = [...selected.value, product.name];
    }
  }

  emit('pick', product);
};
</script>

<template>
  <div class="grid gap-2 items-start content-start">
    <ProductCard
      v-for="product in props.products"
      :product="product"
      @click="pick(product)"
      class="cursor-pointer"
      :class="{ 'selected': selected.includes(product.name) }"
    />
  </div>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fit, 150px);
}

.selected {
  background: var(--color-amber-500);
}
</style>
