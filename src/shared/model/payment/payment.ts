export enum PAY_METHOD {
  cash = 'cash',
  card = 'card',
}

export type Payment = {
  paymentMethod: PAY_METHOD;
  cardOfBank: string | null;
  amount: number;
  currency: string;
};

export type CashPayment = {
  paymentMethod: PAY_METHOD.cash;
  cardOfBank: null;
  amount: number;
  currency: string;
};

export type CardPayment = {
  paymentMethod: PAY_METHOD.card;
  cardOfBank: string;
  amount: number;
  currency: string;
};
