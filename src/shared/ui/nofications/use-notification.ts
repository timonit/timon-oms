import {
  generateNotification,
  type GenerateNotificationInputWithContent,
  type GenerateNotificationInputWithTitle,
} from './generate-notification';
import { useNotificationStore } from './notification.store';

type useNotificationReturn = {
  notify(
    notifyDTO: GenerateNotificationInputWithContent | GenerateNotificationInputWithTitle,
  ): void;
  notifyError(title: string, content?: string): void;
  notifySuccess(title: string, content?: string): void;
  notifyInfo(title: string, content?: string): void;
  notifyWarning(title: string, content?: string): void;
};

export function useNotification(): useNotificationReturn {
  const notificationStore = useNotificationStore();

  const notify = (notifyDTO: GenerateNotificationInputWithTitle) => {
    notificationStore.add(generateNotification(notifyDTO));
  };

  const notifyError = (title: string, content?: string) =>
    notify({ title, content, type: 'error' });
  const notifySuccess = (title: string, content?: string) =>
    notify({ title, content, type: 'success' });
  const notifyInfo = (title: string, content?: string) => notify({ title, content, type: 'info' });
  const notifyWarning = (title: string, content?: string) =>
    notify({ title, content, type: 'warning' });

  return {
    notify,
    notifyError,
    notifySuccess,
    notifyInfo,
    notifyWarning,
  };
}
