<script setup lang="ts">
const model = defineModel();
</script>

<template>
  <input
    class="rounded-lg p-2 bg-white/80"
    v-model="model"
  />
</template>
