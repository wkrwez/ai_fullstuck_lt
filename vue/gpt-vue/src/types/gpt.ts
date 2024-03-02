export interface ChatMessage{
    role:"user" | "assistant" | "system";
    text:string;
}