import styles from "./SidebarRail.module.css";
import { NavLink } from "react-router-dom";
import { useNewChat } from "@/features/conversation/hooks/useNewChat";
import { NAVIGATION_ITEMS } from "@/shared/constants/navigation";

const RailNavigation = () => {
    const handleNewChat = useNewChat();
    return (
        <nav className={styles["navigation"]} id="railNav">
            <button
                type='button'
                className={styles.iconButton} onClick={handleNewChat} id="newChatBtn" data-view="new-chat" title="New Chat">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
            {NAVIGATION_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            isActive
                                ? `${styles.iconButton} ${styles.iconButtonActive}`
                                : styles.iconButton
                        }
                    >
                        <Icon />
                    </NavLink>
                );
            })}
        </nav>
    )
}

export default RailNavigation