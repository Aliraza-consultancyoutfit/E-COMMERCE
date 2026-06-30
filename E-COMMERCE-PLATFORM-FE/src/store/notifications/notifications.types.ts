export type NotificationType = "order" | "promo" | "system";

export interface Notification {
  _id: string;
  user: string;
  type: NotificationType;
  title: string;
  body: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
