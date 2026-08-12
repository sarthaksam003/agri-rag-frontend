import { useState, useEffect } from "react";
import styles from "./ConversationView.module.css";

import { Composer } from "@/features/conversation/components/Composer";
import EmptyConversation from "@/features/conversation/components/EmptyConversation/EmptyConversation";
import MessageList from "@/features/conversation/components/MessageList/MessageList";
import SourceInspector from "@/features/conversation/components/SourceInspector/SourceInspector";

import type { SourceReference } from "@/features/conversation/types/source";

import { useComposer } from "@/features/conversation/hooks/useComposer";
import { useConversation } from "@/features/conversation/hooks/useConversation";

export const ConversationView = () => {
  const {
    messages,
    status,
    sendMessage,
  } = useConversation();

  const composer = useComposer();

  const [selectedSources, setSelectedSources] =
    useState<SourceReference[] | null>(null);

  const handleTextSend = async (text: string) => {
    await sendMessage(text, "text");
    composer.clear();
  };

  const handleVoiceSend = async (text: string) => {
    await sendMessage(text, "voice");
    composer.clear();
  };

  const handleShowSources = (sources: SourceReference[]) => {
    setSelectedSources(sources);
  };

  const handleCloseSources = () => {
    setSelectedSources(null);
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
            isThinking={
              status === "waiting" ||
              status === "streaming"
            }
            onShowSources={handleShowSources}
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