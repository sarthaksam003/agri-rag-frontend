export type StreamState =
    | "idle"
    | "connecting"
    | "streaming"
    | "completed"
    | "cancelled"
    | "error";


// This is a preliminary prototype for the StreamChunk function. I put it here to get an idea when the time comes to make the function
// export interface StreamChunk {
//     conversationId: string;

//     messageId: string;

//     content: string;
// }