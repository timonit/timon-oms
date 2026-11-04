export type NotificationType = 'error' | 'success' | 'info' | 'warning' | 'white';

export type NotificationDTO = {
  id: string;
  title?: string;
  content?: string;
  type: NotificationType;
};
