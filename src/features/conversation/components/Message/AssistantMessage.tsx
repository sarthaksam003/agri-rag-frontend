import type { ChatMessage } from "@/features/conversation/types/message";
import logo from "@/assets/logo.png";
import styles from "./AssistanMessage.module.css";
import { IoCopyOutline } from "react-icons/io5";
import { formatTime } from "@/features/conversation/components/Message/UserMessage";

interface AssistantMessageProps {

  message: ChatMessage;
  className: string;

}

const AssistantMessage = ({
  message,
  className
}: AssistantMessageProps) => {
  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
  };
  return (
    <div className={`${styles.msg} ${styles.assistant}`}>
      <div className={styles["msg-avatar"]}>
        <img src={logo} />
      </div>
      <div className={styles["msg-body"]}>
        <div className={styles["msg-bubble"]}>{message.content}</div>
        {message.sources && message.sources.length > 0 && (
          <div className={styles["citation-row"]}>
            <button
              type="button"
              className={styles["citation-tab"]}
            >
              <span className={styles["cnum"]}>
                {message.sources.length}
              </span>
              Show Sources
            </button>
          </div>
        )}
        {/* <div className={styles["hallucination-badge"]}>
          <span className={styles["dot"]}>
          </span>
          Possible hallucinations detected
        </div> */}

        <div className={styles["msg-actions"]}>
          <button className={styles["tts-btn"]}>
            <span className={styles["tts-bars"]}>
              <span></span>
              <span></span>
              <span></span>
            </span>
            Listen
          {/* // TODO:
          // Invoke the backend TTS endpoint when the Listen button is clicked.
          // Playback state should be managed by audio.store.ts. */}
          </button>
          <button className={styles["copy-btn"]} onClick={handleCopy}>
            <IoCopyOutline />
            Copy
          </button>
          <div className={styles["msg-time"]}>{formatTime(message.createdAt)}</div>
        </div>
      </div>
    </div>
  );

};

export default AssistantMessage;