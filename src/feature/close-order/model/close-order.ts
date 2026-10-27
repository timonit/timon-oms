import { OrderEntity, useOrderStore } from '@/entities/order';
import { useShiftStore } from '@/entities/shift';
import type { Order } from '@/shared/model/order';

export async function closeOrder(order: Order): Promise<void> {
  const orderStore = useOrderStore();
  const shiftStore = useShiftStore();

  const orderEnt = new OrderEntity(order);
  orderEnt.close();

  await orderStore.change(orderEnt.data);

  let profit = 0;
  let orders: Order[] = [];
  const shift = shiftStore.shift;

  if (shiftStore.shift) orders = orderStore.closedOrdersAfterDate(shiftStore.shift?.openedAt);

  orders.forEach((order) => (profit += order.totals.finalTotal));

  if (shift) {
    shift.report = {
      totalProfit: profit,
      orders: orders.map((order) => order.id),
    };

    await shiftStore.changeShift(shift);
  }
}
