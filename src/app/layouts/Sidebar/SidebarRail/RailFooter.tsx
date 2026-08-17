import { useEffect, useRef, useState } from "react";
import styles from "./RailFooter.module.css";
import { useUserMenuStore } from "@/features/navigation/user-menu.store";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { broadcastAuthEvent } from "@/features/auth/hooks/useAuthSync";
import { authApi } from "@/features/auth/api/apiAuth";
import { AUTH_QUERY_KEY } from "@/features/auth/hooks/useAuth";

const RailFooter = () => {
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
                <span className={styles["avatar"]}>SS</span>
            </button>

            {open && (
                <div
                    className={styles.menuLeft}
                    id="railUserMenu"
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
                        {isLoggingOut
                            ? "Logging out..."
                            : "Logout"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default RailFooter;