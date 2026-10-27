import { Entity } from '@/shared/model/entity';
import type { IModificationStore } from '@/shared/model/modification';
import type { Order, OrderPosition } from '@/shared/model/order';
import type { IProductStore } from '@/shared/model/product';

export class OrderEntity extends Entity<Order> {
  constructor(data: Order) {
    super(data);
  }

  protected calculateTotals() {
    const totals: Order['totals'] = {
      subTotal: 0,
      deliveryFee: 0,
      discountAmount: 0,
      finalTotal: 0,
    };

    this.data.positions.forEach((pos) => {
      const productStore = OrderEntity.getStore<IProductStore>('products');
      const modificationStore = OrderEntity.getStore<IModificationStore>('modifications');

      const product = productStore.getProductByName(pos.name);
      if (!product) throw new Error('Product not found');

      totals.subTotal += Number(pos.price) * Number(pos.quantity);
      totals.finalTotal += Number(pos.price) * Number(pos.quantity);

      if (pos.modifications.length) {
        const modifications = modificationStore.getModificationsByName(pos.modifications);
        modifications.forEach((modif) => {
          totals.subTotal += Number(modif.price);
          totals.finalTotal += Number(modif.price);
        });
      }
    });

    return totals;
  }

  setPosition(positions: OrderPosition[]) {
    this.data.positions = positions;

    const newTotals = this.calculateTotals();
    this.data.totals.subTotal = newTotals.subTotal;
    this.data.totals.finalTotal = newTotals.finalTotal;
  }

  close() {
    this.data.status = 'closed';
    this.data.closedAt = new Date();
  }
}
