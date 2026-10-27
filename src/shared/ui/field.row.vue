<script setup lang="ts">
type FieldRowProps = {
  fieldName: string;
  fieldValue: string | number;
};
const props = defineProps<FieldRowProps>();
</script>

<template>
  <div class="flex justify-between gap-4 p-2 bg-surface-2 text-white">
    <span>
      {{ props.fieldName }}:
    </span>

    <span>
      {{ props.fieldValue }}
    </span>
  </div>
</template>
