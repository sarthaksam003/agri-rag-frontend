import { SourceReference } from "@/features/conversation/types/source";

export type MessageRole =
    | "user"
    | "assistant"
    | "system";

export type MessageStatus =
    | "idle"
    | "sending"
    | "streaming"
    | "completed"
    | "error"
    | "cancelled";

export interface ChatMessage {

    id: string;

    conversationId: string;

    role: MessageRole;

    content: string;

    createdAt: Date;

    inputType: MessageInputType;

    status: MessageStatus;

    sources?: SourceReference[];

}

export type MessageInputType =

    | "text"
    | "voice"
    | "suggestion";