// import { useConversationStore } from '@/features/conversation/store/conversation.store';
// import { useSettingsStore } from '@/store/settings.store'
import { useUserMenuStore } from "@/features/navigation/user-menu.store";
import styles from "./SidebarFooter.module.css";
import { HiChevronUp } from 'react-icons/hi2';
import { useEffect, useRef } from "react";
// import { cn } from '@/shared/lib/cn';
export const SidebarFooter = () => {
    // const { tenantId } = useSettingsStore();
    // const { ragMode } = useConversationStore();
    const { open, close, toggle } = useUserMenuStore();
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                ref.current &&
                !ref.current.contains(e.target as Node)
            ) {
                close();
            }
        }

        // document.addEventListener("mousedown", handleClickOutside);

        return () =>
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
    }, [close]);
    return (
        <div className={styles.footer}>
            {open && (
                <div className={styles.menu} id="railUserMenu" ref={ref}>
                    <button className={styles["menuItem"]} data-toast="info|Profile|Profile settings would open here.">Profile settings</button>
                    <div className={styles["menuDivider"]}></div>
                    <button className={`${styles["menuItem"]} ${styles.danger}`} data-toast="error|Logged out|You have been logged out.">Logout</button>
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
        </div >
    )
}
