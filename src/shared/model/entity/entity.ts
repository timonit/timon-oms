import type { Store } from 'pinia';

export abstract class Entity<T> {
  data: T;

  static #stores: Store[] = [];

  static setStores(stores: Store[]) {
    Entity.#stores = stores;
  }

  static getStore<S extends Store>(storeID: string): S {
    const store = Entity.#stores.find((store) => store.$id === storeID) as S;
    if (!store) throw new Error(`Store "${storeID}" is not found`);

    return store;
  }

  constructor(data: T) {
    this.data = data;
  }
}
