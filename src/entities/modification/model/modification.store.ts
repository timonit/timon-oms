import { defineStore, type _GettersTree } from 'pinia';
import type { Modification, ModificationStoreDefinition } from '@/shared/model/modification';
import { ModificationRepo } from './modification.repo';

type ModificationStoreState = {
  fetching: boolean;
  modifications: Modification[];
};

interface ModificationStoreGetters extends _GettersTree<ModificationStoreState> {
  getModificationsByName(state: ModificationStoreState): (names: string[]) => Modification[];
}

interface ModificationStoreActions {
  fetch(): Promise<void>;
  setModifications(modifications: Modification[]): Promise<void>;
  add(modification: Modification): Promise<void>;
  delete(id: string): Promise<void>;
}

export const useModificationStore: ModificationStoreDefinition = defineStore<
  'modifications',
  ModificationStoreState,
  ModificationStoreGetters,
  ModificationStoreActions
>('modifications', {
  state: () => ({
    fetching: false,
    modifications: [],
  }),

  actions: {
    async fetch() {
      const modificationRepo = new ModificationRepo();
      this.modifications = await modificationRepo.getModifications();
    },
    async setModifications(modifications: Modification[]) {
      const modificationRepo = new ModificationRepo();
      await modificationRepo.setModification(modifications);
      this.modifications = modifications;
    },
    async add(modification) {
      const newModifications = [...this.modifications, modification];
      this.setModifications(newModifications);
    },
    async delete(id) {
      const newModifications = this.modifications.filter((mod) => mod.id !== id);
      this.setModifications(newModifications);
    },
  },

  getters: {
    getModificationsByName(state) {
      return (names: string[]) => {
        if (!names || !names.length) return [];
        return state.modifications.filter((mod) => names.includes(mod.name));
      };
    },
  },
});
