import { useModificationStore } from '@/entities/modification';
import type { OrderPosition } from '@/shared/model/order';

export function calculatePositionTotalPrice(position: OrderPosition): number {
  const modificationStore = useModificationStore();
  const modifications = modificationStore.getModificationsByName(position.modifications);

  let totalPrice = Number(position.price) * Number(position.quantity);

  modifications.forEach((modif) => {
    totalPrice += Number(modif.price) * Number(position.quantity);
  });

  return totalPrice;
}
