// Basic types for the simple chat component
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  conversationId: string;
}

export interface ChatConversation {
  id: string;
  user: User;
  lastMessage?: Message;
  unreadCount: number;
}

// Props for the main ChatUI component
export interface ChatUIProps {
  // Data
  conversations: ChatConversation[];
  messages: Message[];
  currentUser: User | null;
  selectedConversationId?: string;
  
  // State
  isLoading?: boolean;
  
  // Event handlers
  onConversationSelect?: (conversationId: string) => void;
  onSendMessage?: (content: string, conversationId: string) => void;
  
  // UI Options
  className?: string;
}
