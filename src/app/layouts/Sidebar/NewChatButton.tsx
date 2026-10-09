import { HiOutlinePlusCircle } from "react-icons/hi2";
import styles from "./NewChatButton.module.css";
import { useTranslation } from "@/features/localization/useTranslation";
import { useNewChat } from "@/features/conversation/hooks/useNewChat";

export const NewChatButton = () => {

    const handleNewChat = useNewChat();
    const { t } = useTranslation();
    return (

        <div
            style={{
                display: "flex",
                justifyContent: "center",
            }}
        >

            <button
                className={styles.button}
                onClick={handleNewChat}
                aria-label={t("actions.newChat")}
            >

                <HiOutlinePlusCircle />

                <span>{t("actions.newChat")}</span>
            </button>

        </div>

    );

};