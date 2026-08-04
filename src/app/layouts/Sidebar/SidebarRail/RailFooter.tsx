import { useEffect, useRef } from "react";
import styles from "./RailFooter.module.css";
import { useUserMenuStore } from "@/features/navigation/user-menu.store";

const RailFooter = () => {
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
        <div className={styles["footer"]} ref={ref}>
            <button className={styles["userTrigger"]} id="railUserTrigger" aria-expanded="false" aria-haspopup="true" onClick={(e) => {
                e.stopPropagation();
                toggle();
            }}
            >
                <span className={styles["avatar"]}>SS</span>
            </button>
            {open && (
                <div className={styles.menuLeft} id="railUserMenu" >
                    <button className={styles["menuItem"]} data-toast="info|Profile|Profile settings would open here.">Profile
                        settings</button>
                    <div className={styles["menuDivider"]}></div>
                    <button className={`${styles["menuItem"]} ${styles.danger}`} data-toast="error|Logged out|You have been logged out.">Logout</button>
                </div>
            )}
        </div>
    )
}

export default RailFooter