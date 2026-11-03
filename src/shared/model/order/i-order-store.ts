import { type _GettersTree, type Store, type StoreDefinition } from 'pinia';
import type { ClosedOrder, OpenedOrder, Order } from './order';

export type OrderStoreState = {
  fetching: boolean;
  orders: Order[];
  count: number;
};

export interface OrderStoreGetters extends _GettersTree<OrderStoreState> {
  openedOrders(state: OrderStoreState): OpenedOrder[];
  closedOrders(state: OrderStoreState): ClosedOrder[];
  ordersAfterDate(state: OrderStoreState): (date: Date) => Order[];
  openedOrdersAfterDate(state: OrderStoreState): (date: Date) => OpenedOrder[];
  closedOrdersAfterDate(state: OrderStoreState): (date: Date) => ClosedOrder[];
  getOrderWithID(state: OrderStoreState): (id: string) => Order | undefined;
  getOrdersWithID(state: OrderStoreState): (ids: string[]) => Order[];
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
