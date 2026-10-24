<script setup lang="ts">
import NavLink from './nav.link.vue';
</script>

<template>
  <header class="p-2 bg-surface flex items-center justify-end">
    <nav class="flex items-center gap-4">
      <NavLink
        :to="{ name: 'Order' }"
        title="Open order"
      />
      <NavLink
        :to="{ name: 'ProductsManager' }"
        title="products manager"
      />
      <NavLink
        :to="{ name: 'Orders' }"
        title="orders"
      />
    </nav>
  </header>
</template>
