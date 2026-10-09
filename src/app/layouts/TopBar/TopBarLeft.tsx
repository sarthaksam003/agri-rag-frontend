// import { StatusPill } from '@/shared/components/ui/StatusPill/StatusPill'
import styles from "./TopBarLeft.module.css";
// import { useSettingsStore } from '@/features/settings/store/settings.store';
import { useTranslation } from "@/features/localization/useTranslation";
import RailToggle from "@/app/layouts/Sidebar/SidebarRail/RailToggle";
import { useConversationStore } from "@/features/conversation/store/conversation.store";

export const TopBarLeft = () => {
    // const { ragMode, maxQueries } = useSettingsStore();
    const { conversationTitle } = useConversationStore();
    const { t } = useTranslation();

    return (
        <div className={styles["topbarLeft"]}>
            <div className={styles.mobileSidebarToggle}>
                <RailToggle />
            </div>
            <div className={styles["topbarContent"]}>
                <div className={styles["topbarTitle"]}>
                    {conversationTitle ?? t("chat.askAboutDocuments")}
                </div>

                <div className={styles["topbarSub"]}>
                    {/* <StatusPill variant={ragMode}>
                        {ragMode === "multiquery"
                            ? t("chat.multiQueryRagMode", {
                                count: maxQueries,
                            })
                            : t("chat.simpleRagMode")}
                    </StatusPill> */}
                    <div className={styles["topbarSub"]}>
                        {/* <StatusPill variant="simple">
                            {t("app.ragChatbot")}
                        </StatusPill> */}
                    </div>
                </div>
            </div>
        </div>
    );
};