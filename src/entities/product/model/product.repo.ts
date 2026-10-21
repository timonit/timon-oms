import { Repo } from '@/shared/model';
import type { Product } from './product';

export class ProductRepo extends Repo<Product> {
  storage_name = 'products';

  async setProducts(products: Product[]): Promise<void> {
    await this.saveStorage(products);
  }

  async getProducts(): Promise<Product[]> {
    return this.getStorage();
  }
}
