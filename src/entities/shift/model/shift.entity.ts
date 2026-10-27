import { Entity } from '@/shared/model/entity';
import type { Shift } from '@/shared/model/shift';

export class ShiftEntity extends Entity<Shift> {
  close() {
    this.data.closedAt = new Date();
    this.data.status = 'closed';
  }
}
