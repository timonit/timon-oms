import { defineStore, type _GettersTree } from 'pinia';
import type { Product } from './product';
import { ProductRepo } from './product.repo';

type ProductStoreState = {
  fetching: boolean;
  products: Product[];
};

interface ProductStoreGetters extends _GettersTree<ProductStoreState> {
  getProductByName(state: ProductStoreState): (name: string) => Product | undefined;
  getProductsByName(state: ProductStoreState): (names: string[]) => Product[];
}

interface ProductStoreActions {
  fetch(): Promise<void>;
  setProducts(products: Product[]): Promise<void>;
  add(product: Product): Promise<void>;
  delete(id: string): Promise<void>;
}

export const useProductStore = defineStore<
  'products',
  ProductStoreState,
  ProductStoreGetters,
  ProductStoreActions
>('products', {
  state: () => ({
    fetching: true,
    products: [],
  }),

  actions: {
    async fetch() {
      this.fetching = true;

      const productRepo = new ProductRepo();
      const products = await productRepo.getProducts();

      this.products = products;
      this.fetching = false;
    },
    async setProducts(products: Product[]) {
      const productRepo = new ProductRepo();
      await productRepo.setProducts(products);
      this.products = products;
    },
    async add(product: Product) {
      const productRepo = new ProductRepo();
      await productRepo.setProducts([...this.products, product]);
      this.products.push(product);
    },
    async delete(id: string) {
      const productRepo = new ProductRepo();
      const newProducts = this.products.filter((prod) => prod.id !== id);
      await productRepo.setProducts(newProducts);
      this.products = newProducts;
    },
  },

  getters: {
    getProductByName(state) {
      return (name: string) => {
        return state.products.find((prod) => prod.name === name);
      };
    },
    getProductsByName(state) {
      return (names: string[]) => {
        return state.products.filter((prod) => names.includes(prod.name));
      };
    },
  },
});
