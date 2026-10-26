import type { OrderPosition } from './order-position';

export type ProductToPositionDTO = {
  name: string;
  type: string;
};

export function productToPosition(product: ProductToPositionDTO): OrderPosition {
  return {
    positionType: 'product',
    quantity: 1,
    tags: [],
    modifications: [],
    ...product,
  };
}
