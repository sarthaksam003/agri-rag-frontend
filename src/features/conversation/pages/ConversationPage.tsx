import ConversationView from "@/features/conversation/components/ConversationView/ConversationView";
import EmptyConversation from "@/features/conversation/components/EmptyConversation/EmptyConversation";
import { useParams } from "react-router-dom";


export function ConversationPage() {
  const { conversationId } = useParams();

  return (
    <div
      style={{
        backgroundColor: "var(--background-app)",
        color: "var(--text-primary)",
      }}
    >
      conversationId
      ? <ConversationView />
      : <EmptyConversation />;
    </div>);
}