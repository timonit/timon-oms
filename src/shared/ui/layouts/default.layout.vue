<script setup lang="ts">
import { AppSystembar } from '../systembar';
</script>

<template>
  <div>
    <slot name="top-panel"></slot>

    <div class="p-4">
      <slot />
    </div>
  </div>
</template>
