import styles from "./SidebarTabs.module.css";
import { NavLink } from "react-router-dom";
import { NAVIGATION_ITEMS } from "@/shared/constants/navigation";
import { useConversationStore } from "@/features/conversation/store/conversation.store";

export const SidebarTabs = () => {
    const sessionId = useConversationStore(
        state => state.sessionId
    );
    return (
        <nav className={styles.nav}>
            {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                    <NavLink
                        key={item.to}
                        to={
                            item.label === "Chat" && sessionId
                                ? `/chat/${sessionId}`
                                : item.to
                        }
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.navItem} ${styles.navItemActive}`
                                : styles.navItem
                        }
                    >
                        <Icon />
                        <span>{item.label}</span>
                    </NavLink>
                );
            })}
        </nav>
    );
};