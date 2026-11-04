import { defineStore, type _GettersTree } from 'pinia';
import type { NotificationDTO } from './notification.dto';

export type NotificationStoreState = {
  notificaions: NotificationDTO[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface NotificationStoreGetters extends _GettersTree<NotificationStoreState> {}

export interface NotificationStoreActions {
  add(notification: NotificationDTO): void;
  remove(notification: NotificationDTO): void;
}

const initState: NotificationStoreState = {
  notificaions: [],
};

export const useNotificationStore = defineStore<
  'notification',
  NotificationStoreState,
  NotificationStoreGetters,
  NotificationStoreActions
>('notification', {
  state() {
    return { ...initState };
  },
  actions: {
    add(notification) {
      this.notificaions = [...this.notificaions, notification];

      setTimeout(() => this.remove(notification), 5000);
    },
    remove(notification) {
      this.notificaions = this.notificaions.filter((notif) => notif.id !== notification.id);
    },
  },
});
