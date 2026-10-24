import { useOrderStore, type Order } from '@/entities/order';

export async function closeOrder(order: Order): Promise<void> {
  const orderStore = useOrderStore();
  const newOrder: Order = { ...order, status: 'closed' };
  await orderStore.change(newOrder);
}
