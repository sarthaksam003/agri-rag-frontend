import { IconButton } from '@/shared/components/ui/IconButton/IconButton'
import styles from "./SidebarHeader.module.css"
import { useSidebarStore } from '@/features/navigation/sidebar.store'
import logo from "@/assets/logo.png"
import cdacLogo from "@/assets/cdacLogo.png";
export const SidebarHeader = () => {
    const { toggleSidebar } = useSidebarStore();
    return (
        <div className={styles.header}>
            <div className={styles.topRow}>
                <div className={styles["brand"]}>
                    <div className={styles.brandInfo}>
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>

                            <img src={cdacLogo}
                                className={styles.logoPlaceholder} height={60} width={60} />
                            {/* <img src={logo}
                                className={styles.logoPlaceholder} height={50} width={50} /> */}
                        </div>
                        <div>
                            <div className={styles.brandName}>AgriRAG</div>
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
