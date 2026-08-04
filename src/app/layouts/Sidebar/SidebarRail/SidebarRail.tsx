import styles from "./SidebarRail.module.css";
import RaileToggle from "./RailToggle";
import RailNavigation from "./RailNavigation";
import { useSidebarStore } from "@/features/navigation/sidebar.store";
import RailFooter from "./RailFooter";

export const SidebarRail = () => {
    const { isCollapsed } = useSidebarStore();

    return (
        <aside className={styles.rail}>
            <RaileToggle />

            {isCollapsed && <RailNavigation />}

            <div className={styles.spacer} />

            {isCollapsed && <RailFooter />}
        </aside>
    );
};