import { useSidebarStore } from "@/features/navigation/sidebar.store";
import styles from "./RailToggle.module.css";
import { IconButton } from "@/shared/components/ui/IconButton/IconButton";
import { useTranslation } from "@/features/localization/useTranslation";

const RailToggle = () => {
    const { toggleSidebar, isCollapsed } = useSidebarStore();
    const { t } = useTranslation();
    const label = !isCollapsed
        ? t("common.closeSidebar")
        : t("common.openSidebar");
    return (
        <IconButton
            icon={isCollapsed ?
                <svg className={styles["iconHamburger"]} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>

                :
                <svg className={styles["iconClose"]} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                </svg>

            }
            title={label}
            aria-label={label}
            onClick={toggleSidebar}
            variant="sidebar"
            className={styles.toggle}
        />
    )
}

export default RailToggle