import { EnumNotificationStatus } from "../enums/notification-status";
import { EnumNotificationType } from "../enums/notification-type";

export interface NotificationEventData {
  id: string;
  type: EnumNotificationType;
  recipient: string;
  subject: string;
  message: string;
  status: EnumNotificationStatus;
}
