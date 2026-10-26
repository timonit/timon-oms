<script setup lang="ts">
import NavLink from './nav.link.vue';
</script>

<template>
  <header class="p-4 bg-surface flex items-center justify-between">
    <div>
      <slot name="left-side" />
    </div>

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
