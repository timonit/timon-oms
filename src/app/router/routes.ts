import { OrderPage } from '@/pages/order';
import { OrdersPage } from '@/pages/orders';
import { ProductsManagerPage } from '@/pages/products-manager';
import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: OrderPage,
    name: 'Home',
  },
  {
    path: '/order/:id?',
    component: OrderPage,
    name: 'Order',
  },
  {
    path: '/products-manager',
    component: ProductsManagerPage,
    name: 'ProductsManager',
  },
  {
    path: '/orders',
    component: OrdersPage,
    name: 'Orders',
  },
];
