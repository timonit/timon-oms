import { Repo } from '@/shared/model';
import type { Shift } from './shift';

export class ShiftRepo extends Repo<Shift> {
  storage_name = 'shifts';

  async setShifts(shifts: Shift[]): Promise<void> {
    await this.saveStorage(shifts);
  }

  async getShifts(): Promise<Shift[]> {
    return this.getStorage();
  }
}
