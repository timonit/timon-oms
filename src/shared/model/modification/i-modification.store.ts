import { type _GettersTree, type Store, type StoreDefinition } from 'pinia';
import type { Modification } from './modification';

export type ModificationStoreState = {
  fetching: boolean;
  modifications: Modification[];
};

export interface ModificationStoreGetters extends _GettersTree<ModificationStoreState> {
  getModificationsByName(state: ModificationStoreState): (names: string[]) => Modification[];
}

export interface ModificationStoreActions {
  fetch(): Promise<void>;
  setModifications(modifications: Modification[]): Promise<void>;
  add(modification: Modification): Promise<void>;
  delete(id: string): Promise<void>;
}

export type IModificationStore = Store<
  'modifications',
  ModificationStoreState,
  ModificationStoreGetters,
  ModificationStoreActions
>;

export type ModificationStoreDefinition = StoreDefinition<
  'modifications',
  ModificationStoreState,
  ModificationStoreGetters,
  ModificationStoreActions
>;
