import { useProductStore } from '@/entities/product';
import type { Product } from '@/shared/model/product';

export type CreateProductDTO = {
  name: string;
  price: number;
  type: string;
  ean?: string;
};

export async function createProduct(product: CreateProductDTO): Promise<Product> {
  const productStore = useProductStore();

  if (productStore.getProductByName(product.name)) throw new Error('Product name already exist');

  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    availableModifications: [],
  };

  await productStore.add(newProduct);

  return newProduct;
}
