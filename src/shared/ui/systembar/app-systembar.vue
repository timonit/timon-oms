<script setup lang="ts">
</script>

<template>
  <header class="p-2 bg-surface flex items-center justify-end">
    <nav class="flex items-center gap-4">
      <RouterLink :to="{ name: 'Home' }">
        create order
      </RouterLink>
      <RouterLink :to="{ name: 'ProductsManager' }">
        products manager
      </RouterLink>
      <RouterLink :to="{ name: 'Orders' }">
        orders
      </RouterLink>
    </nav>
  </header>
</template>

<style scoped>
.router-link-active {
  color: var(--color-white);
  text-decoration: underline;
}
</style>
