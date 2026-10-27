import { ShiftEntity, useShiftStore } from '@/entities/shift';

export async function closeShift() {
  const shiftStore = useShiftStore();
  const shiftData = shiftStore.shift;
  if (!shiftData) throw new Error('No opened shift');

  const shiftEnt = new ShiftEntity(shiftData);
  shiftEnt.close();

  await shiftStore.closeShift(shiftEnt.data);
}
