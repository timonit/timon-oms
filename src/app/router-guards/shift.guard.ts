import { useShiftStore } from '@/entities/shift';
import { OMSApp, StartedStatus } from '@/shared/app';
import type { _Awaitable, RouteLocationNormalizedGeneric } from 'vue-router';

export async function shiftGuard(to: RouteLocationNormalizedGeneric) {
  const shiftStore = useShiftStore();
  const app = OMSApp.instance;

  if (!app.status.isStatus(StartedStatus)) {
    await new Promise<void>((res) => {
      app.addEventListener('changeStatus', () => {
        if (app.status.isStatus(StartedStatus)) res();
      });
    });
  }

  if (shiftStore.isOpenedShift || to.name === 'OpenShift' || to.name === 'ShiftReport') {
    return true;
  }

  return { name: 'OpenShift' };
}
