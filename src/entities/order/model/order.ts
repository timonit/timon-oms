import type { OrderPosition } from '@/shared/model/order-position';

export type Order = {
  id: string;
  createdAt: Date;
  // index number to keep track of the order's position in a list or sequence
  index: number;
  positions: OrderPosition[];
};
