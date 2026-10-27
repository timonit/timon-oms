import type { OrderPosition } from '../../../shared/model/order/order-position';

export type ProductToPositionDTO = {
  name: string;
  type: string;
  price: number;
};

export function productToPosition(product: ProductToPositionDTO): OrderPosition {
  return {
    name: product.name,
    type: product.type,
    price: product.price,
    totalPrice: product.price,
    positionType: 'product',
    quantity: 1,
    tags: [],
    modifications: [],
  };
}
