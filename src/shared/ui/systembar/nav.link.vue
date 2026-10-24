<script setup lang="ts">
import type { RouteLocationAsRelativeGeneric } from 'vue-router';
import AppBtn from '../app-btn.vue';

type NavLinkProps = {
  to: RouteLocationAsRelativeGeneric;
  title?: string;
};

const props = defineProps<NavLinkProps>();
</script>

<template>
  <RouterLink
    :to="props.to"
    v-slot="{ isActive }"
  >
    <AppBtn
      :text="props.title"
      :class="{
        'bg-info': !isActive,
        'bg-success': isActive
      }"
    />
  </RouterLink>
</template>
