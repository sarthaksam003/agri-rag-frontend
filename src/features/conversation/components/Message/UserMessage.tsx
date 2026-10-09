import type { ChatMessage } from "@/features/conversation/types/message";
import styles from "./UserMessage.module.css"
import { IoCopyOutline } from "react-icons/io5";
import { IoCheckmark } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "@/features/localization/useTranslation";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import UserAvatar from "@/shared/components/ui/UserAvatar";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { IoCreateOutline } from "react-icons/io5";
import { IoCloseOutline } from "react-icons/io5";
import { BsSend } from "react-icons/bs";

interface UserMessageProps {
  message: ChatMessage;
  className: string;
  onEdit?: (message: ChatMessage) => void;
  onResend?: (message: ChatMessage, editedContent: string) => void;
  canResend?: boolean;

}

export function formatTime(date: Date) {
  const now = new Date();
  const todayStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
  );
  const messageDayStart = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
  );
  const isYesterday =
    todayStart.getTime() - messageDayStart.getTime() ===
    24 * 60 * 60 * 1000;

  if (isYesterday) {
    return new Intl.DateTimeFormat([], {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }).format(date);
  }

  return new Intl.DateTimeFormat(

    [],

    {

      hour: "numeric",

      minute: "2-digit",

      hour12: true,

    }

  ).format(date);

}

const UserMessage = ({
  message, onEdit,
  onResend,
  canResend = true,
  // className
}: UserMessageProps) => {
  const { t } = useTranslation();
  const { profileName } = useSettingsStore();
  const [isCopied, setIsCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { user } = useAuth();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setIsCopied(true);

      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }

      copyTimeoutRef.current = setTimeout(() => {
        setIsCopied(false);
        copyTimeoutRef.current = null;
      }, 4000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const handleEdit = () => {
    setEditedContent(message.content);
    setIsEditing(true);
    onEdit?.(message);
  };

  const handleResend = () => {
    const trimmedContent = editedContent.trim();

    if (!trimmedContent || !canResend) {
      return;
    }

    onResend?.(message, trimmedContent);
    setEditedContent(trimmedContent);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedContent(message.content);
    setIsEditing(false);
  };
  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);
  return (

    // <div>

    //   <strong>You</strong>

    //   <p>{message.content}</p>

    // </div>
    <div className={`${styles.msg} ${styles.user}`}>
      <div
        className={`${styles["msg-body"]} ${isEditing ? styles["msg-body-editing"] : ""
          }`}
      >
        {isEditing ? (
          <>
            {/* <textarea
              value={editedContent}
              onChange={(event) => setEditedContent(event.target.value)}
              rows={3}
              autoFocus
            /> */}
            <textarea
              value={editedContent}

              className="peer h-full min-h-[100px] w-full resize-none rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50"
              placeholder=" " onChange={(event) => setEditedContent(event.target.value)}
            ></textarea>
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                className={`${styles["copy-btn"]} ${styles["resend-btn"]}`}
                onClick={handleResend}
                disabled={!canResend || !editedContent.trim()}
                title={t("actions.resend")}
              >
                <BsSend />
                {t("actions.resend")}
              </button>

              <button
                type="button"
                className={`${styles["copy-btn"]} ${styles["cancel-btn"]}`}
                onClick={handleCancelEdit}
                title={t("actions.cancel")}
              >
                <IoCloseOutline />
                {t("actions.cancel")}
              </button>
            </div>
          </>
        ) : (
          <div className={styles["msg-bubble"]}>
            {message.content}
          </div>
        )}        {message.inputType === "voice" ?
          <div className={styles["voice-tag"]}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            {t("chat.voiceMessage")}
          </div> : null
        }
        {!isEditing && (
          <div className="flex items-center flex-row-reverse">
            <button
              type="button"
              className={styles["copy-btn"]}
              onClick={handleEdit}
              title={t("actions.edit")}
            >
              <IoCreateOutline />
              {t("actions.edit")}
            </button>

            <button
              type="button"
              className={`${styles["copy-btn"]} ${isCopied ? styles.copied : ""
                }`}
              onClick={handleCopy}
              title={t("actions.copy")}
            >
              {isCopied ? <IoCheckmark /> : <IoCopyOutline />}
              {isCopied ? t("actions.copied") : t("actions.copy")}
            </button>

            <div className={styles["msg-time"]}>
              {formatTime(message.createdAt)}
            </div>
          </div>
        )}      </div>
      <UserAvatar
        name={profileName}
        avatarUrl={user?.profile_picture ?? null}
        className={styles["msg-avatar"]}
        initialsSize="1rem"
      />
    </div>

  );

};

export default UserMessage;
