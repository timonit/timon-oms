<script setup lang="ts">
type CardMiniProps = {
  hover?: boolean;
};

const props = defineProps<CardMiniProps>();
</script>

<template>
  <div
    class="product-card flex flex-col justify-between items-center border border-neutral-200 p-2 gap-2 rounded-lg hover:bg-neutral-200"
    :class="{ 'hover:bg-neutral-200': props.hover }"
  >
    <div class="prepend-block">
      <slot name="prepend" />
    </div>

    <div class="default-block flex flex-col justify-center">
      <slot />
    </div>

    <div class="append-block">
      <slot name="append" />
    </div>
  </div>
</template>

<style scoped>
.product-card {
  width: 150px;
  height: 150px;
}
</style>
