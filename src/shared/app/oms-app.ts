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

  async init(fetchingStores: { fetch: () => Promise<void> }[]) {
    this.setStatus(new LoadingStatus());

    await Promise.all(fetchingStores.map((store) => store.fetch()));

    this.setStatus(new StartedStatus());
  }
}
