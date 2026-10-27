<script setup lang="ts">
import type { Modification } from '@/shared/model/modification';
import { computed, inject } from 'vue';
import { MODIFICATION_LIST_KEY } from './modification.list-service';
import { useProductStore } from '@/entities/product';

const props = defineProps<{ modification: Modification; }>();
const emit = defineEmits<{ (e: 'pick', modification: Modification): void; }>();
const productStore = useProductStore();

const modificationListService = inject(MODIFICATION_LIST_KEY);
if (!modificationListService) throw new Error('ModificationListService not created');


const pick = async (modification: Modification) => {
  if (modificationListService.mode.value === 'pick') {
    modificationListService.select(modification);
  }
  if (modificationListService.mode.value === 'delete' && modificationListService.product && modificationListService.product.availableModifications) {
    modificationListService.product.availableModifications = modificationListService.product.availableModifications.filter((modName) => modification.name !== modName);
    await productStore.setProducts(productStore.products);
  }
  if (modificationListService.mode.value === 'attach') {
    if (modificationListService.product) {
      if (modificationListService.product.availableModifications) modificationListService.product.availableModifications.push(modification.name);
      else {
        modificationListService.product.availableModifications = [modification.name];
      }
      await productStore.setProducts(productStore.products);
    }
    else throw new Error('Product not found');
  }
};

const itemClass = computed(() => {
  if (modificationListService.mode.value === 'pick' && modificationListService.selected.value.includes(props.modification.name)) {
    return 'bg-warning hover:bg-warning/85';
  }
  if (modificationListService.mode.value === 'pick') return 'bg-secondary hover:bg-secondary/85';
  if (modificationListService.mode.value === 'delete') return 'bg-error hover:bg-error/85';
  if (modificationListService.mode.value === 'attach') {
    if (modificationListService.product.availableModifications?.includes(props.modification.name)) {
      return 'bg-success hover:bg-success/85';
    }
    return 'bg-info hover:bg-info/85';
  }
  else return '';
});
</script>

<template>
  <div
    class="flex gap-4 justify-between p-2 text-white rounded cursor-pointer"
    :class="itemClass"
    @click="pick(modification)"
  >
    <span>
      {{ modification.name }}
    </span>
    <span>
      {{ modification.price }}
    </span>
  </div>
</template>
