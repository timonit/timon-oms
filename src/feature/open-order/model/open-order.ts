import { useOrderStore, type Order, type OrderPosition } from '@/entities/order';

export type OpenOrderDTO = {
  positions: OrderPosition[];
};

export async function openOrder(dto: OpenOrderDTO): Promise<Order> {
  const orderStore = useOrderStore();
  const newOrder: Order = {
    ...dto,
    id: crypto.randomUUID(),
    createdAt: new Date(),
    index: orderStore.count + 1,
    status: 'opened',
    totals: {
      subTotal: 0,
      deliveryFee: 0,
      discountAmount: 0,
      finalTotal: 0,
    },
  };

  await orderStore.add(newOrder);

  return newOrder;
}
