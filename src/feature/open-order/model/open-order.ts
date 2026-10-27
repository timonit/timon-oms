import { useOrderStore } from '@/entities/order';
import { OrderEntity } from '@/entities/order/model';
import type { Order, OrderPosition } from '@/shared/model/order';

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

  const orderEnt = new OrderEntity(newOrder);

  await orderStore.add(orderEnt.data);

  return newOrder;
}
