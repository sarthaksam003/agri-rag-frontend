import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ConversationView.module.css";

import { Composer } from "@/features/conversation/components/Composer";
import EmptyConversation from "@/features/conversation/components/EmptyConversation/EmptyConversation";
import MessageList from "@/features/conversation/components/MessageList/MessageList";
import SourceInspector from "@/features/conversation/components/SourceInspector/SourceInspector";

import type { SourceReference } from "@/features/conversation/types/source";
import type { ChatMessage } from "@/features/conversation/types/message";
import { useComposer } from "@/features/conversation/hooks/useComposer";
import { useConversation } from "@/features/conversation/hooks/useConversation";
import { useConversationStore } from "@/features/conversation/store/conversation.store";
import { transcribeAudio } from "@/services/apiClient";
import { DEFAULT_TENANT_ID } from "@/config/apiConfig";
import { useSettingsStore } from "@/features/settings/store/settings.store";
const NEW_CHAT_REQUEST_ID = "__new_chat__";

export const ConversationView = () => {
  const { conversationId } = useParams<{
    conversationId?: string;
  }>();

  const {
    messages,
    status,
    sendMessage,
    resendMessage,
    stopGeneration,
  } = useConversation();

  const composer = useComposer();
  const { language } = useSettingsStore();
  const activeRequestSessionId = useConversationStore(
    state => state.activeRequestSessionId,
  );

  const [selectedSources, setSelectedSources] =
    useState<SourceReference[] | null>(null);

  const isRequestActive =
    status === "waiting" ||
    status === "streaming";

  /*
   * Determine whether the request currently being processed
   * belongs to the conversation that is currently visible.
   *
   * Existing conversation:
   *   activeRequestSessionId === conversationId
   *
   * New conversation:
   *   activeRequestSessionId === NEW_CHAT_REQUEST_ID
   */
  const isCurrentConversationRequest =
    conversationId
      ? activeRequestSessionId === conversationId
      : activeRequestSessionId === NEW_CHAT_REQUEST_ID;

  /*
   * Only show StreamingMessage in the conversation that
   * actually owns the active request.
   */
  const showThinking =
    isRequestActive && isCurrentConversationRequest;

  /*
   * If a request is active but belongs to another conversation,
   * explain why this conversation's composer is disabled.
   */
  const showWaitingForAnotherConversation =
    isRequestActive && !isCurrentConversationRequest;

  const handleTextSend = async (text: string) => {
    await sendMessage(text, "text");
    composer.clear();
  };

  const handleVoiceSend = async (audio: Blob): Promise<string> => {
    const data = await transcribeAudio(
      audio,
      language,
      DEFAULT_TENANT_ID,
    );

    return data.text;
  };

  const handleShowSources = (sources: SourceReference[]) => {
    setSelectedSources(sources);
  };

  const handleCloseSources = () => {
    setSelectedSources(null);
  };

  const handleEditMessage = (message: ChatMessage) => {
    console.log("Edit message:", message.id);
  };

  const handleResendMessage = async (
    message: ChatMessage,
    editedContent: string,
  ) => {
    await resendMessage(message, editedContent);
  };
  
  useEffect(() => {
    if (!selectedSources) {
      return;
    }

    const previous = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [selectedSources]);

  useEffect(() => {
    if (!selectedSources) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseSources();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedSources]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {messages.length === 0 ? (
          <EmptyConversation
            onSuggestionClick={composer.setText}
          />
        ) : (
          <MessageList
            messages={messages}
            isThinking={showThinking}
            onShowSources={handleShowSources}
            onEditMessage={handleEditMessage}
            onResendMessage={handleResendMessage}
            canResend={!isRequestActive}
          />
        )}
      </div>

      <Composer
        value={composer.text}
        onChange={composer.setText}
        onSend={handleTextSend}
        onVoiceSend={handleVoiceSend}
        onStop={stopGeneration}
        showStop={showThinking}
        disabled={isRequestActive}
        waitingForResponse={showWaitingForAnotherConversation}
      />

      {selectedSources && (
        <>
          <div
            className={styles.backdrop}
            onClick={handleCloseSources}
            aria-hidden="true"
          />

          <SourceInspector
            sources={selectedSources}
            onClose={handleCloseSources}
          />
        </>
      )}
    </div>
  );
};