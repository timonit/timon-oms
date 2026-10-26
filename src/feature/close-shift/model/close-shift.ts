import { useShiftStore } from '@/entities/shift';

export async function closeShift() {
  const shiftStore = useShiftStore();
  await shiftStore.closeShift();
}
