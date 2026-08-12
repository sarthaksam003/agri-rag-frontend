import { FiCheck, FiInfo, FiAlertTriangle, FiX } from "react-icons/fi";

 
import styles from "./Toast.module.css";
import { ToastData } from "@/shared/components/types/toast";

interface ToastProps {
    toast: ToastData;
    onDismiss: (id: string) => void;
}

const Toast = ({
    toast,
    onDismiss,
}: ToastProps) => {
    const getIcon = () => {
        switch (toast.type) {
            case "success":
                return <FiCheck />;

            case "error":
                return <FiAlertTriangle />;

            case "warning":
                return <FiAlertTriangle />;

            case "info":
            default:
                return <FiInfo />;
        }
    };

    return (
        <div
            className={`${styles.toast} ${styles[toast.type]}`}
            role={
                toast.type === "error"
                    ? "alert"
                    : "status"
            }
        >
            <div className={styles.icon}>
                {getIcon()}
            </div>

            <div className={styles.message}>
                {toast.message}
            </div>

            <button
                type="button"
                className={styles.close}
                onClick={() =>
                    onDismiss(toast.id)
                }
                aria-label="Dismiss notification"
            >
                <FiX />
            </button>
        </div>
    );
};

export default Toast;