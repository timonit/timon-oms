import { defineStore, type _GettersTree } from 'pinia';
import { OrderRepo } from './order.repo';
import type {
  OrderStoreState,
  OrderStoreGetters,
  OrderStoreActions,
  Order,
  OrderStoreDefinition,
} from '@/shared/model/order';

export const useOrderStore: OrderStoreDefinition = defineStore<
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
      let hasOldVersion = false;
      const orderRepo = new OrderRepo();
      const orders = await orderRepo.getOrders();
      const count = orders.length;

      orders.forEach((order) => {
        order.positions.forEach((pos) => {
          if (!pos.modifications) {
            pos.modifications = [];
            hasOldVersion = true;
          }
        });
        if (!order.totals) {
          order.totals = {
            subTotal: 0,
            deliveryFee: 0,
            discountAmount: 0,
            finalTotal: 0,
          };
        }
      });
      if (hasOldVersion) await orderRepo.setOrders(orders);

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
    closedOrders(state) {
      return state.orders.filter((order) => order.status === 'closed');
    },
    ordersAfterDate(state: OrderStoreState) {
      return (date: Date) => {
        const dateMS = date.getTime();
        return state.orders.filter((order) => order.createdAt.getTime() > dateMS);
      };
    },
    openedOrdersAfterDate(state: OrderStoreState) {
      return (date: Date) => {
        const dateMS = date.getTime();
        return state.orders.filter((order) => {
          return order.status === 'opened' && order.createdAt.getTime() > dateMS;
        });
      };
    },
    closedOrdersAfterDate(state: OrderStoreState) {
      return (date: Date) => {
        const dateMS = date.getTime();
        return state.orders.filter((order) => {
          return order.status === 'closed' && order.createdAt.getTime() > dateMS;
        });
      };
    },
    getOrderWithID(state) {
      return (id: string) => state.orders.find((order) => order.id === id);
    },
  },
});
