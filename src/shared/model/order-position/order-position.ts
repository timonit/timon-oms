import type { Product } from '../product/product';

export type OrderPosition = {
  product: Product;
  quantity: number;
  description?: string;
  tags: string[];
};
