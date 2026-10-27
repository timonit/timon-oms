import { useOrderStore } from '@/entities/order';
import { OrderEntity } from '@/entities/order/model';
import type { Order, OrderPosition } from '@/shared/model/order';

export type ChangeOrderDTO = {
  id: string;
  positions: OrderPosition[];
};

export async function changeOrderPositions({ id, positions }: ChangeOrderDTO): Promise<Order> {
  const orderStore = useOrderStore();
  const order = orderStore.getOrderWithID(id);
  if (!order) throw new Error('Order is not found');

  const orderEnt = new OrderEntity(order);
  orderEnt.setPosition(positions);

  return orderStore.change(orderEnt.data);
}
