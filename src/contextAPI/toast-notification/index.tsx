import {
  createContext,
  PropsWithChildren,
  useCallback,
  useRef,
  useState,
} from "react";
import {
  ToastNotificationConfigType,
  ToastNotificationContextType,
  ToastNotificationDataType,
} from "~/contextAPI/toast-notification/types";
import { Animated } from "react-native";

export const ToastNotificationContext = createContext<
  ToastNotificationContextType | undefined
>(undefined);

interface ToastNotificationProviderProps extends PropsWithChildren {}

export const ToastNotificationProvider = ({
  children,
}: ToastNotificationProviderProps) => {
  const [toasts, setToasts] = useState<Array<ToastNotificationDataType>>([]);
  const animationRef = useRef(new Animated.Value(0));
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const generateId = (): string => Math.random().toString(36).substr(2, 9);

  const show = useCallback((config: ToastNotificationConfigType): string => {
    const id = generateId();
    const toast: ToastNotificationDataType = {
      id,
      type: config.type || "info",
      title: config.title,
      message: config.message,
      icon: config.icon,
      position: config.position || "top",
      duration: config.duration !== undefined ? config.duration : 4000,
    };

    setToasts((prev) => [...prev, toast]);

    // Auto hide after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        hide(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const hide = useCallback((id: string): void => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const hideAll = useCallback((): void => {
    setToasts([]);
  }, []);

  const success = useCallback(
    (
      message: string,
      options: Omit<ToastNotificationConfigType, "message" | "type"> = {},
    ): string => {
      return show({
        type: "success",
        message,
        ...options,
      });
    },
    [show],
  );

  const error = useCallback(
    (
      message: string,
      options: Omit<ToastNotificationConfigType, "message" | "type"> = {},
    ): string => {
      return show({
        type: "error",
        message,
        ...options,
      });
    },
    [show],
  );

  const warning = useCallback(
    (
      message: string,
      options: Omit<ToastNotificationConfigType, "message" | "type"> = {},
    ): string => {
      return show({
        type: "warning",
        message,
        ...options,
      });
    },
    [show],
  );

  const info = useCallback(
    (
      message: string,
      options: Omit<ToastNotificationConfigType, "message" | "type"> = {},
    ): string => {
      return show({
        type: "info",
        message,
        ...options,
      });
    },
    [show],
  );

  const isVisible: boolean = toasts.length > 0;

  const value: ToastNotificationContextType = {
    show,
    hide,
    hideAll,
    success,
    error,
    warning,
    info,
    isVisible,
    toasts,
  };

  return (
    <ToastNotificationContext.Provider value={value}>
      {children}
    </ToastNotificationContext.Provider>
  );
};
