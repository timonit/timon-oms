import type { Store, StoreDefinition } from 'pinia';
import { Entity } from '../model/entity';
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

  static instance: OMSApp;

  constructor() {
    super();
    this.#status = new NostartedStatus();

    OMSApp.instance = this;
  }

  setStatus(status: AppStatus) {
    this.status = status;
  }

  async init(stores: Store[]) {
    this.setStatus(new LoadingStatus());

    const fetchingStores = stores.filter((s) => 'fetch' in s) as { fetch: () => Promise<void> }[];

    await Promise.all(fetchingStores.map((store) => store.fetch()));

    Entity.setStores(stores);

    this.setStatus(new StartedStatus());
  }
}
