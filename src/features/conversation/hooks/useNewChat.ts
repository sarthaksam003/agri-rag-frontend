import { useConversationStore } from "@/features/conversation/store/conversation.store";
import { useNavigate } from "react-router-dom";

export function useNewChat() {

    const navigate = useNavigate();

    const { clearChat } = useConversationStore();

    return () => {

        clearChat();

        navigate("/chat");
    };
}