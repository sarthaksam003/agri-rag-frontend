import styles from "./SidebarTabs.module.css";
import { NavLink } from "react-router-dom";
import { NAVIGATION_ITEMS } from "@/shared/constants/navigation";
import { useConversationStore } from "@/features/conversation/store/conversation.store";
import { useTranslation } from "@/features/localization/useTranslation";
import { useAuth } from "@/features/auth/hooks/useAuth";

export const SidebarTabs = () => {
    const sessionId = useConversationStore(
        state => state.sessionId
    );
    const { t } = useTranslation();
    const { user } = useAuth();
    return (
        <nav className={styles.nav}>
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
                            to={
                                item.to === "/chat" && sessionId
                                    ? `/chat/${sessionId}`
                                    : item.to
                            }
                            className={({ isActive }) =>
                                isActive
                                    ? `${styles.navItem} ${styles.navItemActive}`
                                    : styles.navItem
                            }
                            aria-label={t(item.labelKey)}
                            title={t(item.labelKey)}

                        >
                            <Icon />
                            <span>{t(item.labelKey)}</span>
                        </NavLink>
                    );
                })}
        </nav>
    );
};