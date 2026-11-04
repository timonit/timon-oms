<script setup lang="ts">
const props = defineProps<{ label?: string; }>();
const model = defineModel<boolean>();

const toggle = () => {
  model.value = !model.value;
};
</script>

<template>
  <div
    class="flex gap-2 items-center cursor-pointer"
    @click="toggle"
  >
    <slot name="label">
      <span>
        {{ props.label }}
      </span>
    </slot>

    <div
      class="h-5 w-5 rounded-full bg-white flex items-center justify-center border"
      :class="{
        'border-success': model,
        'border-surface': !model
      }"
    >
      <div
        v-show="model"
        class="h-3 w-3 rounded-full bg-success"
      ></div>
    </div>
    <input
      type="checkbox"
      v-model="model"
      v-show="false"
    />
  </div>
</template>
