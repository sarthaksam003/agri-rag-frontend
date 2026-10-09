import styles from "./DeleteAllButton.module.css";
import { FiTrash } from "react-icons/fi";
import { useTranslation } from "@/features/localization/useTranslation";
interface DeleteAllButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

const DeleteAllButton = ({
    onClick,
    disabled = false,
}: DeleteAllButtonProps) => {
    const { t } = useTranslation();
    return (
        <button
            type="button"
            className={styles["link-btn"]}
            onClick={onClick}
            disabled={disabled}
        >
            <FiTrash />
            {t("actions.deleteAll")}
        </button>
    );
};

export default DeleteAllButton;