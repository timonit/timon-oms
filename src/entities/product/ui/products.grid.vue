<script setup lang="ts">
import type { Product } from '@/shared/model/product';
import ProductCard from './product.card.vue';
import { computed, onMounted, ref } from 'vue';
import { AppToolbar, FlexCol } from '@/shared/ui';

type ProductsGridProps = {
  products: Product[];
  selectable?: boolean;
  byTypes?: boolean;
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

const currentType = ref<string>();

const setCurrentType = (name: string) => {
  currentType.value = name;
};

const types = computed(() => {
  return props.products.reduce<string[]>(
    (acc, prod) => {
      if (!acc.includes(prod.type)) return [...acc, prod.type];
      return acc;
    },
    [] as string[]
  );
});

const actions = computed(() => {
  return types.value.map((type) => ({ text: type, handler: () => setCurrentType(type), selected: type === currentType.value }));
});

const productsByTypes = computed(() => {
  return props.products.filter((p) => p.type === currentType.value);
});

onMounted(() => {
  if (types.value[0]) setCurrentType(types.value[0]);
});
</script>

<template>
  <FlexCol :gap="4">
    <AppToolbar :actions="actions" />

    <div class="grid gap-2 items-start content-start">
      <ProductCard
        v-for="product in productsByTypes"
        :product="product"
        @click="pick(product)"
        class="cursor-pointer select-none"
        :class="{ 'selected': selected.includes(product.name) }"
      />
    </div>
  </FlexCol>
</template>

<style scoped>
.grid {
  grid-template-columns: repeat(auto-fit, 150px);
}

.selected {
  background: var(--color-amber-500);
}
</style>
