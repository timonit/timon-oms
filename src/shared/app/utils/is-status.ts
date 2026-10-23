import type { AppStatus } from '../app-status';

export function isStatus<E extends AppStatus>(status: AppStatus, expectedStatus: E): status is E {
  return status.name === expectedStatus.name;
}
