import { StatusPill } from '@/shared/components/ui/StatusPill/StatusPill'
import styles from "./TopBarLeft.module.css";

export const TopBarLeft = () => {
  return (
    <div className={styles["topbarLeft"]}>
      <div>
        <div className={styles["topbarTitle"]}>Ask about your documents</div>
        <div className={styles["topbarSub"]}>
          <StatusPill
            variant={"simpleRag"}
          >
            Simple RAG
          </StatusPill>
        </div>
      </div>
    </div >
  )
}


