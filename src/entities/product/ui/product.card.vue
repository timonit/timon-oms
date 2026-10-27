<script setup lang="ts">
import type { Product } from '@/shared/model/product';
import CardMini from '@/shared/ui/card.mini.vue';

type ProductProps = {
  product: Product;
  showType?: boolean;
};

const props = defineProps<ProductProps>();
</script>

<template>
  <CardMini hover>
    <template
      v-if="props.showType"
      v-slot:prepend
    >
      <span class="text-xs text-center">
        {{ product.type }}
      </span>
    </template>

    <span class="text-xl font-bold text-center leading-6 uppercase wrap-anywhere">
      {{ product.name }}
    </span>

    <template v-slot:append>
      <span class="text-xl font-bold text-center text-red-700 wrap-anywhere">
        {{ product.price }} ₸
      </span>
    </template>
  </CardMini>
</template>
