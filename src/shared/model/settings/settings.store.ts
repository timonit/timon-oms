import { defineStore, type _GettersTree } from 'pinia';
import type { Settings } from './settings';

export interface SettingsStoreActions {
  save(): void;
}

const initState: Settings = {
  modifications: {
    showPickModeAllModifications: true,
  },
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
    if (settings) return { ...initState, ...JSON.parse(settings) };
    return { ...initState };
  },
  actions: {
    save() {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.$state));
    },
  },
});
