import { useConversationStore } from "@/features/conversation/store/conversation.store";
import { useNavigate } from "react-router-dom";
import { useComposerStore } from "@/features/conversation/store/composer.store";

export function useNewChat() {

    const navigate = useNavigate();

    const clearConversation =
        useConversationStore(state => state.clear);

    const clearComposer =
        useComposerStore(state => state.clear);

    return () => {

        clearConversation();

        clearComposer();

        navigate("/chat");

    };  
}