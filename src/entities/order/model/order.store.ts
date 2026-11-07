import { defineStore, type _GettersTree } from 'pinia';
import { OrderRepo } from './order.repo';
import type {
  OrderStoreState,
  OrderStoreGetters,
  OrderStoreActions,
  Order,
  OrderStoreDefinition,
  ClosedOrder,
  OpenedOrder,
} from '@/shared/model/order';

function normalizeOrders(orders: Order[]): Order[] {
  return orders.map((order) => ({
    ...order,
    positions: order.positions.map((position, index) => ({
      ...position,
      index: position.index ?? index,
      modifications: position.modifications ?? [],
    })),
    totals: order.totals ?? {
      subTotal: 0,
      deliveryFee: 0,
      discountAmount: 0,
      finalTotal: 0,
    },
  }));
}

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
      const orderRepo = new OrderRepo();
      const orders = await orderRepo.getOrders();
      const normalizedOrders = normalizeOrders(orders);
      if (JSON.stringify(orders) !== JSON.stringify(normalizedOrders)) {
        await orderRepo.setOrders(normalizedOrders);
      }
      this.$patch({
        orders: normalizedOrders,
        count: normalizedOrders.length,
      });
      this.fetching = false;
    },
    async setOrders(orders: Order[]) {
      const orderRepo = new OrderRepo();
      const normalizedOrders = normalizeOrders(orders);

      await orderRepo.setOrders(normalizedOrders);
      this.$patch({
        orders: normalizedOrders,
        count: normalizedOrders.length,
      });
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
      const newOrders = [...this.orders];
      newOrders[orderIndex] = newOrder;

      await orderRepo.setOrders(newOrders);
      this.orders = newOrders;

      return newOrder;
    },
  },

  getters: {
    openedOrders(state) {
      return state.orders.filter((order) => order.status === 'opened') as OpenedOrder[];
    },
    closedOrders(state) {
      return state.orders.filter((order) => order.status === 'closed') as ClosedOrder[];
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
        }) as OpenedOrder[];
      };
    },
    closedOrdersAfterDate(state: OrderStoreState) {
      return (date: Date) => {
        const dateMS = date.getTime();
        return state.orders.filter((order) => {
          return order.status === 'closed' && order.createdAt.getTime() > dateMS;
        }) as ClosedOrder[];
      };
    },
    getOrderWithID(state) {
      return (id: string) => state.orders.find((order) => order.id === id);
    },
    getOrdersWithID(state) {
      return (ids: string[]) => state.orders.filter((order) => ids.includes(order.id));
    },
  },
});
