import { Entity } from '@/shared/model/entity';
import { ORDER_STATUS, type Order, type OrderPosition } from '@/shared/model/order';

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
      totals.subTotal += Number(pos.totalPrice);
      totals.finalTotal += Number(pos.totalPrice);
    });

    return totals;
  }

  setPosition(positions: OrderPosition[]) {
    this.data.positions = positions.map((pos, index) => ({ ...pos, index }));

    const newTotals = this.calculateTotals();
    this.data.totals = newTotals;
  }

  close() {
    this.data.status = ORDER_STATUS.closed;
    this.data.closedAt = new Date();
  }
}
