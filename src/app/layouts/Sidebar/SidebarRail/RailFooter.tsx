import { useEffect, useRef, useState } from "react";
import styles from "./RailFooter.module.css";
import { useUserMenuStore } from "@/features/navigation/user-menu.store";
import { NavLink, useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { broadcastAuthEvent } from "@/features/auth/hooks/useAuthSync";
import { authApi } from "@/features/auth/api/apiAuth";
import { AUTH_QUERY_KEY } from "@/features/auth/hooks/useAuth";
import { useTranslation } from "@/features/localization/useTranslation";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import UserAvatar from "@/shared/components/ui/UserAvatar";
import { useAuth } from "@/features/auth/hooks/useAuth";

const RailFooter = () => {
    const { open, close, toggle } = useUserMenuStore();
    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user } = useAuth();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { t } = useTranslation();
    const { profileName } = useSettingsStore();
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                ref.current &&
                !ref.current.contains(e.target as Node)
            ) {
                close();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, [close]);

    const handleLogout = async () => {
        if (isLoggingOut) return;

        setIsLoggingOut(true);

        try {
            await authApi.logout();

            queryClient.removeQueries({
                queryKey: AUTH_QUERY_KEY,
            });

            broadcastAuthEvent({ type: "logout" });
            close();
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <div className={styles["footer"]} ref={ref}>
            <button
                className={styles["userTrigger"]}
                id="railUserTrigger"
                aria-expanded={open}
                aria-haspopup="true"
                onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                }}
            >
                <UserAvatar
                    name={profileName}
                    avatarUrl={user?.profile_picture ?? null}
                    size={34}
                    className={styles.avatar}

                />
            </button>

            {open && (
                <div
                    className={styles.menuLeft}
                    id="railUserMenu"
                >
                    <NavLink to="/settings"
                        className={styles["menuItem"]}
                        onClick={() => close()}
                    >
                        {t("common.profileSettings")}
                    </NavLink>

                    <div className={styles["menuDivider"]}></div>

                    <button
                        className={`${styles["menuItem"]} ${styles.danger}`}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut
                            ? t("common.loggingOut")
                            : t("actions.logout")}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RailFooter;