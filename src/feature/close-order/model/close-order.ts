import { OrderEntity, useOrderStore } from '@/entities/order';
import { useShiftStore } from '@/entities/shift';
import type { Order, OrderPayment } from '@/shared/model/order';
import type { Payment } from '@/shared/model/payment';

export type CloseOrderPaymentDataDTO = {
  payments: Payment[];
  change: number;
};

export type CloseOrderDTO = {
  order: Order;
  paymentData: CloseOrderPaymentDataDTO;
};

export async function closeOrder({ order, paymentData }: CloseOrderDTO): Promise<Order> {
  const orderStore = useOrderStore();
  const shiftStore = useShiftStore();

  const orderEnt = new OrderEntity(order);
  const payment: OrderPayment = {
    id: crypto.randomUUID(),
    orderID: orderEnt.data.id,
    positions: JSON.stringify(orderEnt.data.positions),
    ...paymentData,
  };

  orderEnt.close(payment);

  const updatedOrder = await orderStore.change(orderEnt.data);

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

  return updatedOrder;
}
