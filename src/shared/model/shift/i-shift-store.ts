import { type _GettersTree, type Store, type StoreDefinition } from 'pinia';
import type { Shift, ShiftReport } from './shift';

export type ShiftStoreState = {
  shift?: Shift;
};

export interface ShiftStoreGetters extends _GettersTree<ShiftStoreState> {
  isOpenedShift(state: ShiftStoreState): boolean;
  person(state: ShiftStoreState): string | undefined;
  report(state: ShiftStoreState): ShiftReport | undefined;
  getShift(state: ShiftStoreState): (id: string) => Promise<Shift | undefined>;
}

export interface ShiftStoreActions {
  fetch(): Promise<void>;
  addShift(shift: Shift): Promise<Shift>;
  closeShift(shift: Shift): Promise<void>;
  changeShift(
    partialShift: Omit<Partial<Shift>, 'openedAt' | 'personID'> & { id: string },
  ): Promise<Shift>;
}

export type IShiftStore = Store<'shift', ShiftStoreState, ShiftStoreGetters, ShiftStoreActions>;

export type ShiftStoreDefinition = StoreDefinition<
  'shift',
  ShiftStoreState,
  ShiftStoreGetters,
  ShiftStoreActions
>;
