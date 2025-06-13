export type ToastNotificationIndicationType =
  | "success"
  | "error"
  | "warning"
  | "info";
export type ToastNotificationPosition = "top" | "bottom";

export interface ToastNotificationConfigType {
  type?: ToastNotificationIndicationType;
  title?: string;
  message: string;
  icon?: string;
  position?: ToastNotificationPosition;
  duration?: number;
}

export interface ToastNotificationDataType
  extends Required<Omit<ToastNotificationConfigType, "title" | "icon">> {
  id: string;
  title?: string;
  icon?: string;
}

export type ToastNotificationContextType = {
  show: (config: ToastNotificationConfigType) => string;
  hide: (id: string) => void;
  hideAll: () => void;
  success: (
    message: string,
    options?: Omit<ToastNotificationConfigType, "message" | "type">,
  ) => string;
  error: (
    message: string,
    options?: Omit<ToastNotificationConfigType, "message" | "type">,
  ) => string;
  warning: (
    message: string,
    options?: Omit<ToastNotificationConfigType, "message" | "type">,
  ) => string;
  info: (
    message: string,
    options?: Omit<ToastNotificationConfigType, "message" | "type">,
  ) => string;
  isVisible: boolean;
  toasts: Array<ToastNotificationDataType>;
};
