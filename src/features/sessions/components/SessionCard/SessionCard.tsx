import { FiMessageSquare, FiTrash2 } from "react-icons/fi";

import type { Session } from "../../types/session.types";

import styles from "./SessionCard.module.css";

interface SessionCardProps {
  session: Session;
  onDelete: (session: Session) => void;
  onOpen?: (session: Session) => void;
}

const SessionCard = ({
  session,
  onDelete,
  onOpen,
}: SessionCardProps) => {
  const handleDelete = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();

    onDelete(session);
  };

  const handleOpen = () => {
    onOpen?.(session);
  };

  return (
    <div
      className={styles.row}
      onClick={handleOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
    >
      <div className={styles.icon}>
        <FiMessageSquare />
      </div>

      <div className={styles.main}>
        <div className={styles.title}>
          {session.title}
        </div>

        <div className={styles.subtitle}>
          {session.messageCount}{" "}
          {session.messageCount === 1
            ? "message"
            : "messages"}
        </div>
      </div>

      <button
        type="button"
        className={styles.deleteButton}
        title="Delete session"
        aria-label={`Delete ${session.title}`}
        onClick={handleDelete}
      >
        <FiTrash2 />
      </button>
    </div>
  );
};

export default SessionCard;