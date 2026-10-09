import {
    useEffect,
    useRef,
    type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { FiAlertTriangle, FiX } from "react-icons/fi";

import styles from "./ConfirmationModal.module.css";
import { useTranslation } from "@/features/localization/useTranslation";
interface ConfirmationModalProps {
    open: boolean;

    title: string;
    message?: ReactNode;

    confirmLabel?: string;
    cancelLabel?: string;

    onConfirm: () => void;
    onCancel: () => void;

    destructive?: boolean;
    isLoading?: boolean;

    closeOnBackdropClick?: boolean;
}

const ConfirmationModal = ({
    open,
    title,
    message,

    confirmLabel = "Confirm",
    cancelLabel = "Cancel",

    onConfirm,
    onCancel,

    destructive = false,
    isLoading = false,

    closeOnBackdropClick = true,
}: ConfirmationModalProps) => {
    const confirmButtonRef =
        useRef<HTMLButtonElement>(null);

    const previouslyFocusedElement =
        useRef<HTMLElement | null>(null);
    const { t } = useTranslation();
    useEffect(() => {
        if (!open) {
            return;
        }

        previouslyFocusedElement.current =
            document.activeElement as HTMLElement | null;

        confirmButtonRef.current?.focus();

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape" && !isLoading) {
                onCancel();
            }
        };

        document.addEventListener(
            "keydown",
            handleKeyDown
        );

        return () => {
            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

            previouslyFocusedElement.current?.focus();
        };
    }, [open, onCancel, isLoading]);

    if (!open) {
        return null;
    }

    const handleBackdropClick = (
        event: React.MouseEvent<HTMLDivElement>
    ) => {
        if (
            closeOnBackdropClick &&
            event.target === event.currentTarget &&
            !isLoading
        ) {
            onCancel();
        }
    };

    return createPortal(
        <div
            className={styles.backdrop}
            onMouseDown={handleBackdropClick}
        >
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirmation-modal-title"
                aria-describedby={
                    message
                        ? "confirmation-modal-description"
                        : undefined
                }
            ><button
                type="button"
                className={styles.closeButton}
                onClick={onCancel}
                disabled={isLoading}
                aria-label={t("common.closeConfirmationDialog")}
            >
                    <FiX />
                </button>
                <div className="flex items-center justify-between px-2">

                    <div className={styles.header}>
                        {title === "Adjust picture" ? "" : (
                            <div
                                className={`${styles.icon} ${destructive
                                    ? styles.destructive
                                    : ""
                                    }`}
                                aria-hidden="true"
                            >
                                <FiAlertTriangle />
                            </div>)}
                        <div>

                            <h2
                                id="confirmation-modal-title"
                                className={styles.title}
                            >
                                {title}
                            </h2>
                        </div>
                    </div>


                </div>

                <div className={styles.body}>

                    {message && (
                        <div
                            id="confirmation-modal-description"
                            className={styles.message}
                        >
                            {message}
                        </div>
                    )}
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={styles.cancelButton}
                        onClick={onCancel}
                        disabled={isLoading}
                    >
                        {cancelLabel}
                    </button>

                    <button
                        ref={confirmButtonRef}
                        type="button"
                        className={`${styles.confirmButton} ${destructive
                            ? styles.destructiveConfirm
                            : ""
                            }`}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading
                            ? t("common.pleaseWait")
                            : confirmLabel}
                    </button>
                </div>
            </section>
        </div>,
        document.body
    );
};

export default ConfirmationModal;