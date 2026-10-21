<script setup lang="ts">
import { useProductStore } from '@/entities/product';

const productStore = useProductStore();
productStore.fetch();
</script>

<template>
  <div>
    <router-view />
  </div>
</template>
