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
  type: 'text' | 'file' | 'calendar' | 'voice' | 'mixed';
  fileInfo?: {
    name: string;
    type: string;
    size: string;
    pages?: number;
    url?: string; // Add URL property for file messages
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
  lastMessage: Message;
  unreadCount: number;
  isActive: boolean;
}

export interface ChatMessage extends Message {
  conversationId: string;
  isRead: boolean;
}
