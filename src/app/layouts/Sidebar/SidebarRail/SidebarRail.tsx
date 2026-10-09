import styles from "./SidebarRail.module.css";
import RaileToggle from "./RailToggle";
import RailNavigation from "./RailNavigation";
import { useSidebarStore } from "@/features/navigation/sidebar.store";
import RailFooter from "./RailFooter";

export const SidebarRail = () => {
    const { isCollapsed } = useSidebarStore();

    return (
        <aside
            className={`${styles.rail} ${
                isCollapsed ? styles.railCollapsed : styles.railExpanded
            }`}
        >
            {isCollapsed && <RaileToggle />}

            {isCollapsed && (
                <div className={styles.desktopRailContent}>
                    <RailNavigation />

                    <div className={styles.spacer} />

                    <RailFooter />
                </div>
            )}
        </aside>
    );
};