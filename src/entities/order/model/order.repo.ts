import { Repo } from '@/shared/model/entity';
import type { Order } from '../../../shared/model/order/order';

export class OrderRepo extends Repo<Order> {
  storage_name = 'orders';

  async setOrders(orders: Order[]): Promise<void> {
    await this.saveStorage(orders);
  }

  async getOrders(): Promise<Order[]> {
    const orders = await this.getStorage();
    return orders.map((order) => ({ ...order, createdAt: new Date(order.createdAt) }));
  }
}
