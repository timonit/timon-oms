import { defineStore, type _GettersTree } from 'pinia';
import type { Order } from './order';
import { OrderRepo } from './order.repo';

type OrderStoreState = {
  fetching: boolean;
  orders: Order[];
  count: number;
};

interface OrderStoreGetters extends _GettersTree<OrderStoreState> {
  openedOrders(state: OrderStoreState): Order[];
  getOrderWithID(state: OrderStoreState): (id: string) => Order | undefined;
}

interface OrderStoreActions {
  fetch(): Promise<void>;
  add(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
  change(partialOrder: Omit<Partial<Order>, 'createdAt' | 'id'> & { id: string }): Promise<Order>;
}

export const useOrderStore = defineStore<
  'orders',
  OrderStoreState,
  OrderStoreGetters,
  OrderStoreActions
>('orders', {
  state: () => ({
    fetching: false,
    orders: [],
    count: 0,
  }),

  actions: {
    async fetch() {
      this.fetching = true;
      const orderRepo = new OrderRepo();
      const orders = await orderRepo.getOrders();
      const count = orders.length;
      this.$patch({
        orders,
        count,
      });
      this.fetching = false;
    },
    async add(order) {
      const orderRepo = new OrderRepo();
      const newOrders = [...this.orders, order];
      orderRepo.setOrders(newOrders);
      this.$patch({
        orders: newOrders,
        count: newOrders.length,
      });
    },
    async delete(id: string) {
      const orderRepo = new OrderRepo();
      const newOrders = this.orders.filter((order) => order.id !== id);
      orderRepo.setOrders(newOrders);
      this.$patch({
        orders: newOrders,
        count: newOrders.length,
      });
    },
    async change(partialOrder): Promise<Order> {
      const orderRepo = new OrderRepo();
      const orderIndex = this.orders.findIndex((o) => o.id === partialOrder.id);

      if (orderIndex < 0) throw new Error('Order not found');

      const oldOrder = this.orders[orderIndex];
      const newOrder = { ...oldOrder, ...partialOrder } as Order;

      this.orders[orderIndex] = newOrder;
      orderRepo.setOrders(this.orders);

      return newOrder;
    },
  },

  getters: {
    openedOrders(state) {
      return state.orders.filter((order) => order.status === 'opened');
    },
    getOrderWithID(state) {
      return (id: string) => state.orders.find((order) => order.id === id);
    },
  },
});
