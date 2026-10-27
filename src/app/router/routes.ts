import { OpenShiftPage } from '@/pages/open-shift';
import { OrderPage } from '@/pages/order';
import { OrdersPage } from '@/pages/orders';
import { ProductsManagerPage } from '@/pages/products-manager';
import { ShiftReportPage } from '@/pages/shift-report';
import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: OrderPage,
    name: 'Home',
  },
  {
    path: '/open-shift',
    component: OpenShiftPage,
    name: 'OpenShift',
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
  {
    path: '/shift-report/:id?',
    component: ShiftReportPage,
    name: 'ShiftReport',
  },
];
