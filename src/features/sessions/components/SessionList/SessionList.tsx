import type { Session } from "../../types/session.types";

import SessionCard from "../SessionCard/SessionCard";

import styles from "./SessionList.module.css";

interface SessionListProps {
  sessions: Session[];
  isLoading: boolean;
  isSearching: boolean;
  onDelete: (session: Session) => void;
  onOpen?: (session: Session) => void;
}

const SessionList = ({
  sessions,
  isLoading,
  isSearching,
  onDelete,
  onOpen,
}: SessionListProps) => {
  if (isLoading) {
    return (
      <div className={styles.message}>
        Loading sessions...
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className={styles.message}>
        {isSearching
          ? "No sessions match your search."
          : "No sessions yet."}
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {sessions.map(session => (
        <SessionCard
          key={session.id}
          session={session}
          onDelete={onDelete}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
};

export default SessionList;