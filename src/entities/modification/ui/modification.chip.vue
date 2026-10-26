<script setup lang="ts">
type ModificationChipProps = {
  name: string;
  price?: number;
};
const props = defineProps<ModificationChipProps>();
</script>

<template>
  <div class="px-2 bg-warning rounded-full">
    <span>{{ props.name }} {{ props.price }}</span>
  </div>
</template>
