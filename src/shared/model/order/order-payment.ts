export enum PAY_METHOD {
  cash = 'cash',
  card = 'card',
  hybrid = 'hybrid',
}

export type OrderPayment = {
  id: string;
  orderID: string;
  paymentMethod: PAY_METHOD;

  cash?: number;
  change?: number;

  cardOfBank?: string;

  amount: number;
  currency: string;
  positions: string[];
};

export type CashOrderPayment = {
  id: string;
  orderID: string;
  paymentMethod: PAY_METHOD.cash;

  cash: number;
  change: number;

  amount: number;
  currency: string;
  positions: string[];
};

export type CardOrderPayment = {
  id: string;
  orderID: string;
  paymentMethod: PAY_METHOD.card;

  cardOfBank: string;

  amount: number;
  currency: string;
  positions: string[];
};

export type HybridOrderPayment = {
  id: string;
  orderID: string;
  paymentMethod: PAY_METHOD.hybrid;

  cash: number;
  change: number;
  cardOfBank: string;

  amount: number;
  currency: string;
  positions: string[];
};
