import { useOrderStore, type Order, type OrderPosition, type OrderStatus } from '@/entities/order';

export type ChangeOrderDTO = {
  id: string;
  positions?: OrderPosition[];
  status?: OrderStatus;
  totals?: {
    subTotal: number;
    deliveryFee: number;
    discountAmount: number;
    finalTotal: number;
  };
};

export async function changeOrder(dto: ChangeOrderDTO): Promise<Order> {
  const orderStore = useOrderStore();
  const order = await orderStore.change(dto);

  return order;
}
