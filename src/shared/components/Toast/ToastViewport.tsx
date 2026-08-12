import { createPortal } from "react-dom";


import Toast from "./Toast";

import styles from "./ToastViewport.module.css";
import { ToastData } from "@/shared/components/types/toast";

interface ToastViewportProps {
    toasts: ToastData[];
    onDismiss: (id: string) => void;
}

const ToastViewport = ({
    toasts,
    onDismiss,
}: ToastViewportProps) => {
    if (typeof document === "undefined") {
        return null;
    }

    return createPortal(
        <div
            className={styles.viewport}
            aria-live="polite"
            aria-label="Notifications"
        >
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    toast={toast}
                    onDismiss={onDismiss}
                />
            ))}
        </div>,
        document.body
    );
};

export default ToastViewport;