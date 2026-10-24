import { useModificationStore, type Modification } from '@/entities/modification';
import type { Product } from '@/entities/product';
import { ref, watch, type InjectionKey, type Ref } from 'vue';

export type ModificationListMode = 'add' | 'delete' | 'pick' | 'attach';

export class ModificationListService {
  mode = ref<ModificationListMode>('pick');

  product: Product;

  modifications = ref<Modification[]>([]);
  selected: Ref<string[]>;

  constructor(product: Product, selected: Ref<string[]>) {
    const modificationStore = useModificationStore();

    this.product = product;
    this.selected = selected;

    watch(
      this.mode,
      () => {
        if (product) {
          if (this.mode.value === 'pick') {
            this.modifications.value = modificationStore.getModificationsByName(
              product.availableModifications || [],
            );
          }
          if (this.mode.value === 'delete') {
            this.modifications.value = modificationStore.getModificationsByName(
              product.availableModifications || [],
            );
          }
          if (this.mode.value === 'attach') {
            this.modifications.value = modificationStore.modifications;
          }
        }
      },
      { immediate: true },
    );
  }

  select(modification: Modification) {
    if (this.selected.value.includes(modification.name)) {
      this.selected.value = this.selected.value.filter((name) => modification.name !== name);
    } else {
      this.selected.value = [...this.selected.value, modification.name];
    }
  }
}

export const MODIFICATION_LIST_KEY = Symbol() as InjectionKey<ModificationListService>;
