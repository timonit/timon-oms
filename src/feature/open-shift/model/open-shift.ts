import { ShiftEntity, useShiftStore } from '@/entities/shift';
import type { Shift } from '@/shared/model/shift';

type OpenShiftDTO = {
  personID: string;
};

export async function openShift(dto: OpenShiftDTO): Promise<Shift> {
  const shiftStore = useShiftStore();
  const shift: Shift = {
    id: crypto.randomUUID(),
    personID: dto.personID,
    openedAt: new Date(),
    status: 'opened',
    report: {
      totalProfit: 0,
      orders: [],
    },
  };

  const shiftEnt = new ShiftEntity(shift);

  const addedShift = await shiftStore.addShift(shiftEnt.data);

  return addedShift;
}
