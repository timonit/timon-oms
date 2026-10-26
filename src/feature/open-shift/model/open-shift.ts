import { useShiftStore, type Shift } from '@/entities/shift';

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

  const addedShift = await shiftStore.addShift(shift);

  return addedShift;
}
