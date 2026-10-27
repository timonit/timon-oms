import type { _GettersTree, Store, StoreDefinition } from 'pinia';
import type { Product } from './product';

export type ProductStoreState = {
  fetching: boolean;
  products: Product[];
};

export interface ProductStoreGetters extends _GettersTree<ProductStoreState> {
  getProductByName(state: ProductStoreState): (name: string) => Product | undefined;
  getProductsByName(state: ProductStoreState): (names: string[]) => Product[];
}

export interface ProductStoreActions {
  fetch(): Promise<void>;
  setProducts(products: Product[]): Promise<void>;
  add(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}

export type IProductStore = Store<
  'products',
  ProductStoreState,
  ProductStoreGetters,
  ProductStoreActions
>;

export type ProductStoreDifinition = StoreDefinition<
  'products',
  ProductStoreState,
  ProductStoreGetters,
  ProductStoreActions
>;
