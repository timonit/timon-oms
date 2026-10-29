import type { Payment } from '../payment';

export type OrderPayment = {
  id: string;
  orderID: string;
  payments: Payment[];
  // сдача
  change?: number;
  positions: string;
};
