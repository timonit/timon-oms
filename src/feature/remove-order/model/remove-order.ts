import { useOrderStore } from '@/entities/order';

export async function removeOrder(orderID: string): Promise<void> {
  const orderStore = useOrderStore();
  await orderStore.delete(orderID);
}
