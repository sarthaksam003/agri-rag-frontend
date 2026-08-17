import { useUserMenuStore } from "@/features/navigation/user-menu.store";
import styles from "./SidebarFooter.module.css";
import { HiChevronUp } from "react-icons/hi2";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { broadcastAuthEvent } from "@/features/auth/hooks/useAuthSync";
import { authApi } from "@/features/auth/api/apiAuth";
import { AUTH_QUERY_KEY } from "@/features/auth/hooks/useAuth";

export const SidebarFooter = () => {
    const { open, close, toggle } = useUserMenuStore();

    const ref = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                ref.current &&
                !ref.current.contains(e.target as Node)
            ) {
                close();
            }
        }

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

            // Remove the authenticated user from React Query cache.
            queryClient.removeQueries({
                queryKey: AUTH_QUERY_KEY,
            });
            broadcastAuthEvent({ type: "logout" });
            close();

            // Go back to the login page.
            navigate("/login", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            
            setIsLoggingOut(false);
        }
    };

    return (
        <div className={styles.footer}>
            {open && (
                <div
                    className={styles.menu}
                    id="railUserMenu"
                    ref={ref}
                >
                    <button
                        className={styles["menuItem"]}
                    >
                        Profile settings
                    </button>

                    <div className={styles["menuDivider"]}></div>

                    <button
                        className={`${styles["menuItem"]} ${styles.danger}`}
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                    >
                        {isLoggingOut ? "Logging out..." : "Logout"}
                    </button>
                </div>
            )}

            <button
                className={styles.userCard}
                onClick={(e) => {
                    e.stopPropagation();
                    toggle();
                }}
            >
                <div className={styles.userCardLayout}>
                    <span className={styles.avatar}>
                        SS
                    </span>

                    <div className={styles.userInfo}>
                        <div className={styles.userName}>
                            Sarthak Sambharia
                        </div>

                        <div className={styles.userRole}>
                            Employee
                        </div>
                    </div>
                </div>

                <HiChevronUp color="white" />
            </button>
        </div>
    );
};