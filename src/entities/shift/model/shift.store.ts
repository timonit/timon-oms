import { defineStore, type _GettersTree } from 'pinia';
import type { Shift, ShiftReport } from './shift';
import { ShiftRepo } from './shift.repo';

type ShiftStoreState = {
  shift?: Shift;
};

interface ShiftStoreGetters extends _GettersTree<ShiftStoreState> {
  isOpenedShift(state: ShiftStoreState): boolean;
  person(state: ShiftStoreState): string | undefined;
  report(state: ShiftStoreState): ShiftReport | undefined;
}

interface ShiftStoreActions {
  fetch(): Promise<void>;
  addShift(shift: Shift): Promise<Shift>;
  closeShift(): Promise<void>;
  changeShift(
    partialShift: Omit<Partial<Shift>, 'openedAt' | 'personID'> & { id: string },
  ): Promise<Shift>;
}

export const useShiftStore = defineStore<
  'shift',
  ShiftStoreState,
  ShiftStoreGetters,
  ShiftStoreActions
>('shift', {
  state: () => ({}),

  actions: {
    async fetch() {
      const shiftRepo = new ShiftRepo();
      const shifts = await shiftRepo.getShifts();
      const openedShifts = shifts.filter((shift) => shift.status === 'opened');

      if (openedShifts.length) {
        if (openedShifts.length > 1) {
          shifts.forEach((shift) => (shift.status = 'closed'));
          shiftRepo.setShifts(shifts);

          throw new Error('Opened shifts more then 1');
        }

        this.shift = openedShifts[0];
      }
    },

    async addShift(shift) {
      const shiftRepo = new ShiftRepo();
      const oldShifts = await shiftRepo.getShifts();
      const newShifts = [...oldShifts, shift];

      await shiftRepo.setShifts(newShifts);
      this.shift = shift;

      return this.shift;
    },

    async closeShift() {
      const shiftRepo = new ShiftRepo();

      if (!this.shift) throw new Error('No opened shift');
      const shift = this.shift;

      const shifts = await shiftRepo.getShifts();
      const shiftIndex = shifts.findIndex((sh) => sh.id === shift.id);
      if (shiftIndex < 0) throw new Error('Shift is not found');

      shifts[shiftIndex] = { ...shift, status: 'closed' };

      await shiftRepo.setShifts(shifts);

      this.shift = undefined;
    },

    async changeShift(partialShift) {
      const shiftRepo = new ShiftRepo();
      if (!this.shift) throw new Error('No opened shift');

      const newShift: Shift = { ...this.shift, ...partialShift };
      const shifts = await shiftRepo.getShifts();
      const shiftIndex = shifts.findIndex((sh) => sh.id === newShift.id);
      if (shiftIndex < 0) throw new Error('Shift is not found');
      shifts[shiftIndex] = newShift;

      await shiftRepo.setShifts(shifts);
      this.shift = newShift;

      return this.shift;
    },
  },

  getters: {
    isOpenedShift(state: ShiftStoreState) {
      return !!(state.shift && state.shift.status === 'opened');
    },
    person(state: ShiftStoreState) {
      if (!state.shift) return undefined;
      return state.shift.personID;
    },
    report(state: ShiftStoreState) {
      if (!state.shift) return undefined;
      return state.shift.report;
    },
  },
});
