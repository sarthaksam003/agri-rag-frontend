import styles from "./MessageList.module.css";
import { useEffect, useRef } from "react";
import type { ChatMessage } from "@/features/conversation/types/message";
import type { SourceReference } from "@/features/conversation/types/source";

import UserMessage from "../Message/UserMessage";
import AssistantMessage from "../Message/AssistantMessage";
// import StreamingMessage from "@/features/conversation/components/Message/StreamingMessage";

interface MessageListProps {
  messages: ChatMessage[];
  isThinking?: boolean;
  onShowSources: (sources: SourceReference[]) => void;
  onEditMessage?: (message: ChatMessage) => void;
  onResendMessage?: (
    message: ChatMessage,
    editedContent: string,
  ) => void;
  canResend?: boolean;
}

const MessageList = ({
  messages,
  onEditMessage,
  onResendMessage,
  canResend,
  onShowSources,
}: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages,
    // isThinking
  ]);
  return (

    <div className={styles.list}>

      {messages.map((message) =>

        message.role === "user"

          ? (

            <UserMessage
              key={message.id}
              message={message}
              className={styles.userMessage}
              onEdit={onEditMessage}
              onResend={onResendMessage}
              canResend={canResend}
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
      {/* {isThinking && <StreamingMessage />} */}
      <div ref={bottomRef} />
    </div>


  );

};

export default MessageList;