// Core types for the standalone chat component
export interface User {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  title?: string;
  rating?: number;
  responseTime?: string;
  location?: string;
  memberSince?: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  senderId: string;
  conversationId: string;
  type: 'text' | 'file' | 'calendar' | 'voice' | 'mixed';
  fileInfo?: {
    name: string;
    type: string;
    size: string;
    pages?: number;
    url?: string;
  };
  calendarInfo?: {
    title: string;
    timeSlots: Array<{
      time: string;
      available: boolean;
    }>;
  };
}

export interface ChatConversation {
  id: string;
  user: User;
  lastMessage?: Message;
  unreadCount: number;
  isActive?: boolean;
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
  onSendMessage?: (message: Omit<Message, 'id' | 'timestamp'>) => void;
  onFileUpload?: (file: File, fileInfo: any, conversationId?: string) => void;
  onLoadMoreMessages?: (conversationId: string) => void;
  
  // UI Options
  className?: string;
  showProfile?: boolean;
  showWelcomeScreen?: boolean;
}
