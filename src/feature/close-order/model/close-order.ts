import { OrderEntity, useOrderStore } from '@/entities/order';
import { useProductStore } from '@/entities/product';
import { useShiftStore } from '@/entities/shift';
import { ORDER_STATUS, type Order, type OrderPayment } from '@/shared/model/order';
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
  const productStore = useProductStore();
  const shiftStore = useShiftStore();
  if (orderStore.getOrderWithID(order.id)?.status !== ORDER_STATUS.opened) {
    throw new Error('Order is not open');
  }

  const orderEnt = new OrderEntity(order);
  const payment: OrderPayment = {
    id: crypto.randomUUID(),
    orderID: orderEnt.data.id,
    positions: JSON.stringify(orderEnt.data.positions),
    ...paymentData,
  };

  orderEnt.close(payment);

  const updatedOrder = await orderStore.change(orderEnt.data);

  const orderedQuantities = new Map<string, number>();
  order.positions.forEach((position) => {
    orderedQuantities.set(
      position.name,
      (orderedQuantities.get(position.name) ?? 0) + position.quantity,
    );
  });

  const updatedProducts = productStore.products.map((product) => {
    if (product.stock === undefined) return product;

    const quantity = orderedQuantities.get(product.name);
    if (quantity === undefined) return product;

    return { ...product, stock: product.stock - quantity };
  });
  await productStore.setProducts(updatedProducts);

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
