import type { ChatMessage } from "@/features/conversation/types/message";
import styles from "./UserMessage.module.css"
import { IoCopyOutline } from "react-icons/io5";
interface UserMessageProps {
  message: ChatMessage;
  className: string;
}

export function formatTime(date: Date) {

  return new Intl.DateTimeFormat(

    [],

    {

      hour: "numeric",

      minute: "2-digit",

    }

  ).format(date);

}

const UserMessage = ({
  message,
  className
}: UserMessageProps) => {

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
  };
  return (

    // <div>

    //   <strong>You</strong>

    //   <p>{message.content}</p>

    // </div>
    <div className={`${styles.msg} ${styles.user}`}>
      <div className={styles["msg-body"]}>
        <div className={styles["msg-bubble"]}> {message.content} </div>
        {message.inputType === "voice" ?
          <div className={styles["voice-tag"]}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            </svg>
            Voice message
          </div> : null
        }
        <div>
          <button className={styles["copy-btn"]} onClick={handleCopy}>
            <IoCopyOutline />
            Copy
          </button>

          <div className={styles["msg-time"]}>{formatTime(message.createdAt)}</div>
        </div>
      </div>
      <div className={styles["msg-avatar"]}>SS</div>
    </div>

  );

};

export default UserMessage;