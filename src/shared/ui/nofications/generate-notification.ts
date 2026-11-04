import type { NotificationDTO, NotificationType } from './notification.dto';

export type GenerateNotificationInput = {
  type?: NotificationType;
  content?: string;
  title?: string;
};

export type GenerateNotificationInputWithContent = GenerateNotificationInput & {
  content: string;
};

export type GenerateNotificationInputWithTitle = GenerateNotificationInput & {
  title: string;
};

export function generateNotification(notif: GenerateNotificationInputWithTitle): NotificationDTO;
export function generateNotification(notif: GenerateNotificationInputWithContent): NotificationDTO;
export function generateNotification(
  notif: GenerateNotificationInputWithTitle | GenerateNotificationInputWithContent,
): NotificationDTO {
  return {
    id: crypto.randomUUID(),
    type: 'white',
    ...notif,
  };
}
