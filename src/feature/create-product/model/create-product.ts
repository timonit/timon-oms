import { useProductStore, type Product } from '@/entities/product';

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
  };

  await productStore.add(newProduct);

  return newProduct;
}
