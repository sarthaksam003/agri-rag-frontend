import {
    createContext,
    useCallback,
    useMemo,
    useState,
    type ReactNode,
} from "react";

import ToastViewport from "@/shared/components/Toast/ToastViewport";
import { ToastData, ToastType } from "@/shared/components/types/toast";

interface ToastOptions {
    type?: ToastType;
    duration?: number;
}

interface ToastContextValue {
    showToast: (
        message: string,
        options?: ToastOptions
    ) => void;

    dismissToast: (id: string) => void;
}

export const ToastContext =
    createContext<ToastContextValue | null>(null);

interface ToastProviderProps {
    children: ReactNode;
}

const ToastProvider = ({
    children,
}: ToastProviderProps) => {
    const [toasts, setToasts] =
        useState<ToastData[]>([]);

    const dismissToast = useCallback(
        (id: string) => {
            setToasts((currentToasts) =>
                currentToasts.filter(
                    (toast) => toast.id !== id
                )
            );
        },
        []
    );

    const showToast = useCallback(
        (
            message: string,
            options: ToastOptions = {}
        ) => {
            const id = crypto.randomUUID();

            const toast: ToastData = {
                id,
                message,
                type: options.type ?? "info",
                duration: options.duration ?? 4000,
            };

            setToasts((currentToasts) => [
                ...currentToasts,
                toast,
            ]);
            if(toast.duration === null)
            {
                return;
            }
            if (toast.duration > 0) {
                window.setTimeout(() => {
                    dismissToast(id);
                }, toast.duration);
            }
        },
        [dismissToast]
    );

    const contextValue = useMemo(
        () => ({
            showToast,
            dismissToast,
        }),
        [showToast, dismissToast]
    );

    return (
        <ToastContext.Provider
            value={contextValue}
        >
            {children}

            <ToastViewport
                toasts={toasts}
                onDismiss={dismissToast}
            />
        </ToastContext.Provider>
    );
};

export default ToastProvider;