import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { ConversationView } from "@/features/conversation/components/ConversationView/ConversationView";
import { getMockConversation } from "@/features/conversation/services/mockConversation.repository";
import { useConversationStore } from "@/features/conversation/store/conversation.store";

export const ConversationPage = () => {
  const { conversationId } = useParams<{
    conversationId?: string;
  }>();
  console.log("URL conversationId:", conversationId);
  const setSessionId = useConversationStore(
    state => state.setSessionId
  );

  const setMessages = useConversationStore(
    state => state.setMessages
  );

  const clear = useConversationStore(
    state => state.clear
  );

  const setStatus = useConversationStore(
    state => state.setStatus
  );

  useEffect(() => {
    if (!conversationId) {
      clear();
      return;
    }

    const conversation =
      getMockConversation(conversationId);
    console.log("Loaded conversation:", conversation);
    if (!conversation) {
      clear();
      setStatus("error");
      return;
    }

    setSessionId(conversation.id);
    setMessages(conversation.messages);
    setStatus("idle");
  }, [
    conversationId,
    clear,
    setSessionId,
    setMessages,
    setStatus,
  ]);

  return <ConversationView />;
};