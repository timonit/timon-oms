import type { OrderPayment } from './order-payment';
import type { OrderPosition } from './order-position';

export enum ORDER_STATUS {
  opened = 'opened',
  closed = 'closed',
}

export type Order = {
  id: string;
  createdAt: Date;
  closedAt?: Date;
  // index number to keep track of the order's position in a list or sequence
  index: number;
  positions: OrderPosition[];
  status: ORDER_STATUS;
  totals: {
    subTotal: number;
    deliveryFee: number;
    discountAmount: number;
    finalTotal: number;
  };
  pay?: OrderPayment;
};

export type OpenedOrder = {
  id: string;
  index: number;
  createdAt: Date;
  positions: OrderPosition[];
  status: ORDER_STATUS.opened;
  totals: {
    subTotal: number;
    deliveryFee: number;
    discountAmount: number;
    finalTotal: number;
  };
};

export type ClosedOrder = {
  id: string;
  index: number;
  createdAt: Date;
  closedAt: Date;
  positions: OrderPosition[];
  status: ORDER_STATUS.closed;
  totals: {
    subTotal: number;
    deliveryFee: number;
    discountAmount: number;
    finalTotal: number;
  };
  pay: OrderPayment;
};
