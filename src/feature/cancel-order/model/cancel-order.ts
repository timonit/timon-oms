import { OrderEntity, useOrderStore } from '@/entities/order';
import type { Order } from '@/shared/model/order';

export async function cancelOrder(order: Order): Promise<Order> {
  const orderStore = useOrderStore();
  const orderEnt = new OrderEntity(order);

  orderEnt.cancel();

  return orderStore.change(orderEnt.data);
}
