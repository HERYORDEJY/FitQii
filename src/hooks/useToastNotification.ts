import { useContext } from "react";
import { ToastNotificationContextType } from "~/contextAPI/toast-notification/types";
import { ToastNotificationContext } from "~/contextAPI/toast-notification";

export const useToastNotification = (): ToastNotificationContextType => {
  const context = useContext(ToastNotificationContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};
