import { useOrderStore } from '@/entities/order';
import { useProductStore } from '@/entities/product';
import { LoadingStatus, NostartedStatus, StartedStatus, type AppStatus } from './app-status';

export class OMSApp extends EventTarget {
  #status: AppStatus;

  get status(): AppStatus {
    return this.#status;
  }

  set status(status: AppStatus) {
    this.#status = status;
    this.dispatchEvent(new Event('changeStatus'));
  }

  constructor() {
    super();
    this.#status = new NostartedStatus();
  }

  setStatus(status: AppStatus) {
    this.status = status;
  }

  async init() {
    this.setStatus(new LoadingStatus());

    const productStore = useProductStore();
    const orderStore = useOrderStore();

    await Promise.all([productStore.fetch(), orderStore.fetch()]);

    this.setStatus(new StartedStatus());
  }
}
