import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SessionList from "../components/SessionList/SessionList";
import { useSessions } from "../hooks/useSessions";
import type { Session } from "../types/session.types";

import ConfirmationModal from "@/shared/components/ConfirmationModal/ConfirmationModal";
import { useTranslation } from "@/features/localization/useTranslation";
import styles from "./SessionsPage.module.css";
import { HiOutlineClock } from "react-icons/hi2";
import SessionSearch from "@/features/sessions/components/SessionSearch/SessionSearch";

const SessionsPage = () => {
  const {
    filteredSessions,
    search,
    setSearch,
    isLoading,
    isRefreshing,
    refreshSessions,
    removeSession,
  } = useSessions();
  const { t } = useTranslation();
  const [sessionToDelete, setSessionToDelete] =
    useState<Session | null>(null);
  const navigate = useNavigate();
  const handleDeleteRequest = (session: Session) => {
    setSessionToDelete(session);
  };

  const handleDeleteConfirm = async () => {
    if (!sessionToDelete) {
      return;
    }

    const session = sessionToDelete;

    setSessionToDelete(null);

    try {
      await removeSession(session.id);
    } catch {
      // removeSession already displays the error toast.
    }
  };

  const handleDeleteCancel = () => {
    setSessionToDelete(null);
  };

  const handleOpenSession = (session: Session) => {
    navigate(`/chat/${session.id}`);
  };
  return (
    <section className={styles.view}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <div className={styles.titleRow}>
              <span className={styles.titleIcon}>
                <HiOutlineClock />
              </span>

              <h1 className={styles.title}>
                {t("sessions.title")}
              </h1>
            </div>

            <p className={styles.description}>
              {t("sessions.description")}
            </p>
          </div>
        </header>

        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            {t("sessions.recentSessions")}
          </h2>

          <button
            type="button"
            className={styles.refreshButton}
            onClick={refreshSessions}
            disabled={isRefreshing}
          >
            <span
              className={
                isRefreshing
                  ? styles.spinning
                  : undefined
              }
            >
              ↻
            </span>

            {isRefreshing
              ? t("sessions.refreshing")
              : t("sessions.refresh")}
          </button>
        </div>
        <SessionSearch
          value={search}
          onChange={setSearch}
        />
        <SessionList
          sessions={filteredSessions}
          isLoading={isLoading}
          isSearching={search.trim().length > 0}
          onDelete={handleDeleteRequest}
          onOpen={handleOpenSession}
        />
      </div>

      <ConfirmationModal
        open={sessionToDelete !== null}
        title={t("sessions.deleteTitle")}
        message={
          sessionToDelete
            ? t("sessions.deleteMessage", {
              title: sessionToDelete.title,
            })
            : ""
        }
        confirmLabel={t("actions.delete")}
        cancelLabel={t("actions.cancel")}
        destructive
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </section>
  );
};

export default SessionsPage;