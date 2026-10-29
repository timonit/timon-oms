export type OrderPosition = {
  index: number;
  name: string;
  type: string;
  positionType: string;
  quantity: number;
  description?: string;
  tags: string[];
  modifications: string[];
  price: number;
  totalPrice: number;
};
