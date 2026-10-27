import { defineStore, type _GettersTree } from 'pinia';
import { ProductRepo } from './product.repo';
import type {
  ProductStoreActions,
  ProductStoreGetters,
  ProductStoreState,
  Product,
  ProductStoreDifinition,
} from '@/shared/model/product';

export const useProductStore: ProductStoreDifinition = defineStore<
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
