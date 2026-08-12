import styles from "./DeleteAllButton.module.css";
import { FiTrash } from "react-icons/fi";

interface DeleteAllButtonProps {
    onClick: () => void;
    disabled?: boolean;
}

const DeleteAllButton = ({
    onClick,
    disabled = false,
}: DeleteAllButtonProps) => {
    return (
        <button
            type="button"
            className={styles["link-btn"]}
            onClick={onClick}
            disabled={disabled}
        >
            <FiTrash />
            Delete all
        </button>
    );
};

export default DeleteAllButton;