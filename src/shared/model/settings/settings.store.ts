import { defineStore, type _GettersTree } from 'pinia';
import type { Settings } from './settings';

export interface SettingsStoreActions {
  save(): void;
  setProductTypesOrder(order: string[]): void;
}

const initState: Settings = {
  modifications: {
    showPickModeAllModifications: true,
  },
  productTypesOrder: [],
};

const SETTINGS_KEY = 'settings';

export const useSettingsStore = defineStore<
  'settings',
  Settings,
  _GettersTree<Settings>,
  SettingsStoreActions
>('settings', {
  state() {
    const settings = localStorage.getItem(SETTINGS_KEY);
    if (settings) {
      const parsedSettings: unknown = JSON.parse(settings);
      if (typeof parsedSettings === 'object' && parsedSettings !== null) {
        const values = parsedSettings as Partial<Settings>;
        return {
          ...initState,
          ...values,
          modifications: {
            ...initState.modifications,
            ...values.modifications,
          },
          productTypesOrder: Array.isArray(values.productTypesOrder)
            ? values.productTypesOrder.filter((type): type is string => typeof type === 'string')
            : [],
        };
      }
    }
    return { ...initState };
  },
  actions: {
    save() {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.$state));
    },
    setProductTypesOrder(order: string[]) {
      this.productTypesOrder = order;
      this.save();
    },
  },
});
