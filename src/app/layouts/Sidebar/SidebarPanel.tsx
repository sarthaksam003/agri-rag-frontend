import styles from "./SidebarPanel.module.css";
import { SidebarHeader } from "./SidebarHeader";
import { NewChatButton } from "./NewChatButton";
import { SidebarTabs } from "./SidebarTabs";
import { useSidebarStore } from "@/features/navigation/sidebar.store";
import { SidebarFooter } from "@/app/layouts/Sidebar/SidebarFooter";

export default function SidebarPanel() {
    const { isCollapsed } = useSidebarStore();
    return (
        <aside className={`${styles.panel} ${isCollapsed ? styles.collapsed : ""}`}>

            <SidebarHeader />

            <NewChatButton />

            <SidebarTabs />

            <div className={styles.spacer} />

            {!isCollapsed && <SidebarFooter />}

        </aside>
    );
}