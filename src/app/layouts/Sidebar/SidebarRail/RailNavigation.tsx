import styles from "./SidebarRail.module.css";
import { NavLink } from "react-router-dom";
import { useNewChat } from "@/features/conversation/hooks/useNewChat";
import { NAVIGATION_ITEMS } from "@/shared/constants/navigation";
import { useTranslation } from "@/features/localization/useTranslation";
import { useAuth } from "@/features/auth/hooks/useAuth";
const RailNavigation = () => {
    const handleNewChat = useNewChat();
    const { user } = useAuth();
    const { t } = useTranslation();
    return (
        <nav className={styles["navigation"]} id="railNav">
            <button
                type='button'
                className={styles.iconButton} onClick={handleNewChat} id="newChatBtn" data-view="new-chat" title={t("actions.newChat")}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
            </button>
            {NAVIGATION_ITEMS
                .filter(
                    (item) =>
                        item.to !== "/documents" || user?.is_superuser
                )
                .map((item) => {
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
                            title={item.title}
                            aria-label={item.title}
                        >
                            <Icon aria-hidden="true"/>
                        </NavLink>
                    );
                })}
        </nav>
    )
}

export default RailNavigation