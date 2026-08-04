import { useConversationStore } from '@/features/conversation/store/conversation.store';
import { HiOutlinePlusCircle } from 'react-icons/hi2';
import styles from "./NewChatButton.module.css";
import { useNavigate } from 'react-router-dom';

export const NewChatButton = () => {
    const { clearChat } = useConversationStore();
    const navigate = useNavigate();
    return (
        <div className="" style={{ display: "flex", justifyContent: "center" }}>
            <button
                onClick={() => {
                    clearChat();
                    navigate("/chat");
                }}
                className={styles.button}
            >
                <HiOutlinePlusCircle />

                <span>New Chat</span>
            </button>
        </div>
    )
}
