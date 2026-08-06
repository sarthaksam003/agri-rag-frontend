import { HiOutlinePlusCircle } from "react-icons/hi2";
import styles from "./NewChatButton.module.css";

import { useNewChat } from "@/features/conversation/hooks/useNewChat";

export const NewChatButton = () => {

    const handleNewChat = useNewChat();

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
            >

                <HiOutlinePlusCircle />

                <span>New Chat</span>

            </button>

        </div>

    );

};