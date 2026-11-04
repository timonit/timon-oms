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
      class="h-5 w-5 rounded-full bg-white flex items-center justify-center border-2"
      :class="{
        'border-success': model,
        'border-surface/50': !model
      }"
    >
      <div
        class="h-3 w-3 rounded-full "
        :class="{
          'bg-success': model,
          'bg-surface/20': !model,
        }"
      ></div>
    </div>
    <input
      type="checkbox"
      v-model="model"
      v-show="false"
    />
  </div>
</template>
