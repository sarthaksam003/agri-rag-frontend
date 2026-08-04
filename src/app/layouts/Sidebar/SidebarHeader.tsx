import { IconButton } from '@/shared/components/ui/IconButton/IconButton'
import styles from "./SidebarHeader.module.css"
import { useSidebarStore } from '@/features/navigation/sidebar.store'
import logo from "@/assets/logo.png"
export const SidebarHeader = () => {
    const { toggleSidebar } = useSidebarStore();
    return (
        <div className={styles.header}>
            <div className={styles.topRow}>
                <div className={styles["brand"]}>
                    <div className={styles.brandInfo}>
                        <img src={logo}
                            className={styles.logoPlaceholder} height={80} width={80} />
                        <div>
                            <div className={styles.brandName}>CaRAG</div>
                            <div className={styles.brandSub}>
                                RAG chatbot
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
