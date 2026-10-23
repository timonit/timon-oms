<script setup lang="ts">
import { AppSystembar } from '../systembar';
</script>

<template>
  <div>
    <app-systembar />
    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
