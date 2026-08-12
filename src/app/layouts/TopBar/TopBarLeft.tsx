import { StatusPill } from '@/shared/components/ui/StatusPill/StatusPill'
import styles from "./TopBarLeft.module.css";
import { useSettingsStore } from '@/features/settings/store/settings.store';
export const TopBarLeft = () => {
  const { ragMode, maxQueries } = useSettingsStore();
  return (
    <div className={styles["topbarLeft"]}>
      <div>
        <div className={styles["topbarTitle"]}>Ask about your documents</div>
        <div className={styles["topbarSub"]}>
          <StatusPill
            variant={ragMode}
          >
            {ragMode == "multi" ? `Multi-query RAG mode (${maxQueries} queries)` : "Simple RAG mode"}
          </StatusPill>
        </div>
      </div>
    </div >
  )
}


