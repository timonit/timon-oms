<script setup lang="ts">
import type { Product } from '@/shared/model/product';
import { DefaultLayout } from '@/shared/ui/layouts';
import { ProductsGrid } from '@/shared/ui/product';

const products: Product[] = [
  {
    name: 'Strawberry asd',
    price: 1,
    type: 'vegetables',
    ean: 'asd'
  },
  {
    name: 'Burger',
    price: 2,
    type: 'vegetables',
    ean: '1234'
  },
  {
    name: 'Burger',
    price: 3,
    type: 'vegetables',
    ean: '1234'
  },
  {
    name: 'Burger',
    price: 4,
    type: 'vegetables',
    ean: '1234'
  },
  {
    name: 'Burger',
    price: 5,
    type: 'vegetables',
    ean: '1234'
  },
  {
    name: 'Burger',
    price: 6,
    type: 'vegetables',
    ean: '1234'
  },
  {
    name: 'Burger',
    price: 7,
    type: 'vegetables',
    ean: '1234'
  },
];

const pickProduct = (product: Product) => {
  console.log('pick product', product);
};
</script>

<template>
  <DefaultLayout>
    <div>
      <ProductsGrid
        :products="products"
        @pick="pickProduct"
      />
    </div>
  </DefaultLayout>
</template>
