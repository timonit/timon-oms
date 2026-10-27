import { Repo } from '@/shared/model/entity';
import type { Shift } from '../../../shared/model/shift/shift';

export class ShiftRepo extends Repo<Shift> {
  storage_name = 'shifts';

  async setShifts(shifts: Shift[]): Promise<void> {
    await this.saveStorage(shifts);
  }

  async getShifts(): Promise<Shift[]> {
    const shifts = await this.getStorage();
    return shifts.map((shift) => {
      const normalizeShift = {
        ...shift,
        openedAt: new Date(shift.openedAt),
      };

      if (shift.closedAt) normalizeShift.closedAt = new Date(shift.closedAt);

      return normalizeShift;
    });
  }
}
