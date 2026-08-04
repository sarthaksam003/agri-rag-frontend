import { LanguageSelector } from '@/app/layouts/TopBar/LanguageSelector'
import { IconButton } from '@/shared/components/ui/IconButton/IconButton'
import styles from "./TopBarRight.module.css";

export const TopBarRight = () => {
  return (
    <div className={styles["topbarRight"]}>
      <LanguageSelector />
      <IconButton
        icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="18" rx="1" /><rect x="14" y="3" width="7" height="18" rx="1" /></svg>}
        title={"Toggle source inspector"}
      />
      <IconButton
        icon={<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1" /><circle cx="12" cy="5" r="1" /><circle cx="12" cy="19" r="1" /></svg>}
        title={"Session options"}
      />
    </div>
  )
}
