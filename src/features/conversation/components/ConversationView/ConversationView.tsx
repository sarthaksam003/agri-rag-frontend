import styles from "./ConversationView.module.css";

import { Composer } from "@/features/conversation/components/Composer";
import EmptyConversation from "@/features/conversation/components/EmptyConversation/EmptyConversation";
import MessageList from "@/features/conversation/components/MessageList/MessageList";

import { useComposer } from "@/features/conversation/hooks/useComposer";
import { useConversation } from "@/features/conversation/hooks/useConversation";

export const ConversationView = () => {
  const {

    messages,

    status,

    sendMessage,

  } = useConversation();

  const composer = useComposer();

  const handleTextSend = async (
    text: string,
  ) => {

    await sendMessage(
      text,
      "text",
    );

    composer.clear();

  };

  const handleVoiceSend = async (
    text: string,
  ) => {

    await sendMessage(
      text,
      "voice",
    );

    composer.clear();

  };

  return (

    <div className={styles.container}>

      <div className={styles.content}>

        {messages.length === 0 ? (

          <EmptyConversation onSuggestionClick={composer.setText} />

        ) : (

          <MessageList
            messages={messages}
            isThinking={
              status === "waiting" ||
              status === "streaming"
            }
          />

        )}

      </div>

      <Composer

        value={composer.text}

        onChange={composer.setText}

        onSend={handleTextSend}

        onVoiceSend={handleVoiceSend}

        setTranscript={composer.setText}

        disabled={status !== "idle"}

      />

    </div>

  );

};