<script setup lang="ts">
import { useSettingsStore } from '@/shared/model/settings';
import { AppBtn } from '@/shared/ui';
import { PhCheckFat, PhFunnelSimple } from '@phosphor-icons/vue';
import { computed, ref, watch } from 'vue';

defineOptions({ name: 'ProductTypeTabs' });

const props = defineProps<{
  types: string[];
}>();

const currentType = defineModel<string>();
const settingsStore = useSettingsStore();
const isReordering = ref(false);
const draggedType = ref<string>();

const orderedTypes = computed(() => {
  const savedOrder = settingsStore.productTypesOrder;
  return [
    ...savedOrder.filter((type) => props.types.includes(type)),
    ...props.types.filter((type) => !savedOrder.includes(type)),
  ];
});

watch(
  orderedTypes,
  (types) => {
    if (types.length && !types.includes(currentType.value ?? '')) {
      currentType.value = types[0];
    }
  },
  { immediate: true },
);

watch(
  () => props.types,
  (types) => {
    const savedOrder = settingsStore.productTypesOrder;
    const nextOrder = [
      ...savedOrder.filter((type) => types.includes(type)),
      ...types.filter((type) => !savedOrder.includes(type)),
    ];

    if (
      nextOrder.length !== savedOrder.length ||
      nextOrder.some((type, index) => type !== savedOrder[index])
    ) {
      settingsStore.setProductTypesOrder(nextOrder);
    }
  },
  { immediate: true },
);

const startDraggingType = (event: DragEvent, type: string) => {
  draggedType.value = type;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', type);
  }
};

const dropType = (targetType: string) => {
  const sourceType = draggedType.value;
  draggedType.value = undefined;
  if (!sourceType || sourceType === targetType) return;

  const nextOrder = [...orderedTypes.value];
  const sourceIndex = nextOrder.indexOf(sourceType);
  const targetIndex = nextOrder.indexOf(targetType);
  if (sourceIndex < 0 || targetIndex < 0) return;

  nextOrder.splice(sourceIndex, 1);
  nextOrder.splice(targetIndex, 0, sourceType);
  settingsStore.setProductTypesOrder(nextOrder);
};

const toggleReordering = () => {
  isReordering.value = !isReordering.value;
  draggedType.value = undefined;
};

const typeButtonClass = (type: string) => ({
  'bg-success text-white': type === currentType.value,
  'bg-surface-2 hover:bg-secondary hover:text-white': type !== currentType.value,
  'cursor-grab active:cursor-grabbing': isReordering.value,
  'opacity-50': isReordering.value && draggedType.value === type,
});
</script>

<template>
  <div class="flex flex-wrap items-center gap-2 rounded-xl bg-surface p-2">
    <button
      v-for="type in orderedTypes"
      :key="type"
      type="button"
      :draggable="isReordering"
      class="rounded-lg px-3 py-2 text-sm font-bold uppercase select-none"
      :class="typeButtonClass(type)"
      @click="!isReordering && (currentType = type)"
      @dragstart="startDraggingType($event, type)"
      @dragover="isReordering && $event.preventDefault()"
      @drop="isReordering && ($event.preventDefault(), dropType(type))"
      @dragend="draggedType = undefined"
    >
      {{ type }}
    </button>
    <AppBtn
      :color="isReordering ? 'success' : 'surface-2'"
      class="rounded-lg px-3 py-2 ml-auto"
      :aria-pressed="isReordering"
      @click="toggleReordering"
    >
      <PhFunnelSimple v-if="!isReordering" />
      <PhCheckFat
        v-if="isReordering"
        weight="fill"
      />
    </AppBtn>
  </div>
</template>
