import styles from "./MessageList.module.css";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/features/conversation/types/message";
import type { SourceReference } from "@/features/conversation/types/source";

import UserMessage from "../Message/UserMessage";
import AssistantMessage from "../Message/AssistantMessage";
import StreamingMessage from "@/features/conversation/components/Message/StreamingMessage";

interface MessageListProps {

  messages: ChatMessage[];

  isThinking: boolean;
  onShowSources: (sources: SourceReference[]) => void;

}

const MessageList = ({
  messages, isThinking, onShowSources
}: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {

    bottomRef.current?.scrollIntoView({

      behavior: "smooth",

    });

  }, [messages]);
  return (

    <div className={styles.list}>

      {messages.map((message) =>

        message.role === "user"

          ? (

            <UserMessage
              key={message.id}
              message={message}
              className={styles.userMessage}
            />

          )

          : (

            <AssistantMessage
              key={message.id}
              message={message}
              className={styles.assistantMessage}
              onShowSources={onShowSources}
            />
          )

      )}
      {isThinking && <StreamingMessage />}
      <div ref={bottomRef} />
    </div>


  );

};

export default MessageList;