import styles from "./SidebarHeader.module.css";
import RailToggle from "./SidebarRail/RailToggle";
import cdacLogo from "@/assets/cdacLogo.png";
import { useTranslation } from "@/features/localization/useTranslation";

export const SidebarHeader = () => {
    const { t } = useTranslation();

    return (
        <div className={styles.header}>
            <div className={styles.topRow}>
                <div className={styles.brand}>
                    <div className={styles.brandInfo}>
                        <div
                            
                        >
                            <img
                                src={cdacLogo}
                                className={styles.logoPlaceholder}
                                height={60}
                                width={60}
                                alt="CDAC - Centre for Development of Advanced Computing"
                            />
                        </div>
                        <div style={{marginTop:"0.4rem"}}>
                            <div className={styles.brandName}>AgriChat</div>
                            <div className={styles.brandSub}>
                                {t("app.ragChatbot")}
                            </div>
                        </div>


                    </div>
                </div>

                <div className={styles.closeButton}>
                    <RailToggle />
                </div>
            </div>
        </div>
    );
};