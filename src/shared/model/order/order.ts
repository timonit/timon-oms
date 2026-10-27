import type { OrderPosition } from './order-position';

export type OrderStatus = 'opened' | 'closed';

export type Order = {
  id: string;
  createdAt: Date;
  closedAt?: Date;
  // index number to keep track of the order's position in a list or sequence
  index: number;
  positions: OrderPosition[];
  status: OrderStatus;
  totals: {
    subTotal: number;
    deliveryFee: number;
    discountAmount: number;
    finalTotal: number;
  };
};
