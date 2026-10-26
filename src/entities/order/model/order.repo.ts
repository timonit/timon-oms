import { Repo } from '@/shared/model';
import type { Order } from './order';

export class OrderRepo extends Repo<Order> {
  storage_name = 'orders';

  async setOrders(orders: Order[]): Promise<void> {
    await this.saveStorage(orders);
  }

  async getOrders(): Promise<Order[]> {
    return this.getStorage();
  }
}
