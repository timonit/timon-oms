import { Entity } from '@/shared/model/entity';
import { ORDER_STATUS, type IOrderStore } from '@/shared/model/order';
import type { Shift } from '@/shared/model/shift';

export class ShiftEntity extends Entity<Shift> {
  close() {
    const orderStore = ShiftEntity.getStore<IOrderStore>('orders');
    const orders = orderStore.ordersAfterDate(this.data.openedAt);
    const hasOpenedOrders = orders.some((order) => order.status === ORDER_STATUS.opened);

    if (hasOpenedOrders) throw new Error('Есть открытые заказы. Закройте или отмените их.');

    this.data.closedAt = new Date();
    this.data.status = 'closed';
  }
}
