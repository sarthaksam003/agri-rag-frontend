import styles from "./StreamingMessage.module.css";
import logo from "@/assets/logo.png";
const StreamingMessage = () => {
  return (
    <div className={`${styles.msg} ${styles.assistant} ${styles["typing-row"]}`}>
      <div className={styles["msg-avatar"]}>
        <img src={logo} height="60" width="60" />
      </div>
      <div className={styles["msg-body"]}>
        <div className={`${styles["msg-bubble"]} ${styles["typing-indicator"]}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  )
}

export default StreamingMessage