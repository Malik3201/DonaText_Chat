import { ChatConversation, Message, User } from './types';

// Sample users
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzM0RDE5NCIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TPC90ZXh0Pjwvc3ZnPg==',
    status: 'online'
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzYzNjZGMSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NPC90ZXh0Pjwvc3ZnPg==',
    status: 'online'
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI0Y1OUUwQiIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FPC90ZXh0Pjwvc3ZnPg==',
    status: 'offline'
  }
];

// Sample messages
export const sampleMessages: Message[] = [
  {
    id: '1',
    content: 'Hi! How are you today?',
    timestamp: '2024-01-15T10:30:00Z',
    senderId: '1',
    conversationId: '1'
  },
  {
    id: '2',
    content: 'I\'m doing great! How about you?',
    timestamp: '2024-01-15T10:45:00Z',
    senderId: 'current-user',
    conversationId: '1'
  },
  {
    id: '3',
    content: 'Pretty good! Working on some new projects.',
    timestamp: '2024-01-15T11:00:00Z',
    senderId: '1',
    conversationId: '1'
  },
  {
    id: '4',
    content: 'Hello! Are you available for a quick chat?',
    timestamp: '2024-01-14T14:20:00Z',
    senderId: '2',
    conversationId: '2'
  },
  {
    id: '5',
    content: 'Sure! What\'s up?',
    timestamp: '2024-01-14T14:25:00Z',
    senderId: 'current-user',
    conversationId: '2'
  },
  {
    id: '6',
    content: 'Hey there! Long time no see.',
    timestamp: '2024-01-13T16:10:00Z',
    senderId: '3',
    conversationId: '3'
  }
];

// Sample conversations
export const sampleConversations: ChatConversation[] = [
  {
    id: '1',
    user: sampleUsers[0],
    lastMessage: sampleMessages[2],
    unreadCount: 1
  },
  {
    id: '2',
    user: sampleUsers[1],
    lastMessage: sampleMessages[4],
    unreadCount: 0
  },
  {
    id: '3',
    user: sampleUsers[2],
    lastMessage: sampleMessages[5],
    unreadCount: 2
  }
];

// Current user
export const currentUser: User = {
  id: 'current-user',
  name: 'John Doe',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzEwQjk4MSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5KPC90ZXh0Pjwvc3ZnPg==',
  status: 'online'
};
