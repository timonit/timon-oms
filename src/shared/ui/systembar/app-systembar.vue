<script setup lang="ts">
import NavLink from './nav.link.vue';
</script>

<template>
  <header class="p-4 bg-surface flex items-center justify-between">
    <div>
      <slot name="left-side" />
    </div>

    <nav class="flex flex-wrap items-center gap-4">
      <NavLink
        :to="{ name: 'Order' }"
        title="Главная"
      />
      <NavLink
        :to="{ name: 'Orders' }"
        title="Все заказы"
      />
      <NavLink
        :to="{ name: 'ProductsManager' }"
        title="Управление продуктами"
      />
      <NavLink
        :to="{ name: 'Modifications' }"
        title="Модификации"
      />
      <NavLink
        :to="{ name: 'ShiftReport' }"
        title="Отчёт о смене"
      />
    </nav>
  </header>
</template>
