import { changeOrderPositions } from '@/feature/change-order-positions';
import type { Order, OrderPosition } from '@/shared/model/order';
import { type InjectionKey, type Ref } from 'vue';

export class OrderControlCardService {
  order: Ref<Order>;

  constructor(order: Ref<Order>) {
    this.order = order;
  }

  async changePositions(positions: OrderPosition[]) {
    this.order.value = await changeOrderPositions({ id: this.order.value.id, positions });
  }

  async changePosition(position: OrderPosition) {
    const positions = this.order.value.positions.map((pos) => {
      if (pos.index === position.index) {
        return {
          ...pos,
          ...position,
        };
      }
      return pos;
    });

    this.changePositions(positions);
  }
}

export const ORDER_CONTROL_CARD_SERVICE_INJECT_KEY =
  Symbol() as InjectionKey<OrderControlCardService>;
