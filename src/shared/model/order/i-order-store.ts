import { type _GettersTree, type Store, type StoreDefinition } from 'pinia';
import type { Order } from './order';

export type OrderStoreState = {
  fetching: boolean;
  orders: Order[];
  count: number;
};

export interface OrderStoreGetters extends _GettersTree<OrderStoreState> {
  openedOrders(state: OrderStoreState): Order[];
  closedOrders(state: OrderStoreState): Order[];
  ordersAfterDate(state: OrderStoreState): (date: Date) => Order[];
  openedOrdersAfterDate(state: OrderStoreState): (date: Date) => Order[];
  closedOrdersAfterDate(state: OrderStoreState): (date: Date) => Order[];
  getOrderWithID(state: OrderStoreState): (id: string) => Order | undefined;
}

export interface OrderStoreActions {
  fetch(): Promise<void>;
  add(order: Order): Promise<void>;
  delete(id: string): Promise<void>;
  change(partialOrder: Omit<Partial<Order>, 'createdAt' | 'id'> & { id: string }): Promise<Order>;
}

export type IOrderStore = Store<'orders', OrderStoreState, OrderStoreGetters, OrderStoreActions>;

export type OrderStoreDefinition = StoreDefinition<
  'orders',
  OrderStoreState,
  OrderStoreGetters,
  OrderStoreActions
>;
