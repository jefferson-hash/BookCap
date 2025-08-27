export interface ChatMessage {
  ID?: string;
  chat_ID: string;
  sender_ID: string;
  content: string;
  createdAt?: string;
  isRead?: boolean;
}
