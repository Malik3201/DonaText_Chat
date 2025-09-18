import { ChatConversation, Message, User } from './types';

// Sample users
export const sampleUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzM0RDE5NCIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TPC90ZXh0Pjwvc3ZnPg==',
    status: 'online',
    title: 'UI/UX Designer',
    rating: 4.9,
    responseTime: '~1 hour',
    location: 'New York, USA',
    memberSince: '2022'
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzYzNjZGMSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NPC90ZXh0Pjwvc3ZnPg==',
    status: 'online',
    title: 'Full Stack Developer',
    rating: 4.8,
    responseTime: '~30 mins',
    location: 'San Francisco, USA',
    memberSince: '2021'
  }
];

// Sample messages
export const sampleMessages: Message[] = [
  {
    id: '1',
    content: 'Hi! I saw your project posting about the mobile app design. I\'d love to discuss how I can help you create an amazing user experience.',
    timestamp: '2024-01-15T10:30:00Z',
    senderId: '1',
    conversationId: '1',
    type: 'text'
  },
  {
    id: '2',
    content: 'That sounds great! I\'m looking for someone who can create modern, clean designs with great UX principles.',
    timestamp: '2024-01-15T10:45:00Z',
    senderId: 'current-user',
    conversationId: '1',
    type: 'text'
  },
  {
    id: '3',
    content: 'Perfect! I have 5+ years of experience in mobile app design. Here\'s my portfolio with similar projects.',
    timestamp: '2024-01-15T11:00:00Z',
    senderId: '1',
    conversationId: '1',
    type: 'file',
    fileInfo: {
      name: 'Sarah_Portfolio_2024.pdf',
      type: 'application/pdf',
      size: '2.4 MB'
    }
  },
  {
    id: '4',
    content: 'Hello! I\'m interested in your React.js development project. I have extensive experience with React, Node.js, and MongoDB.',
    timestamp: '2024-01-14T14:20:00Z',
    senderId: '2',
    conversationId: '2',
    type: 'text'
  }
];

// Sample conversations
export const sampleConversations: ChatConversation[] = [
  {
    id: '1',
    user: sampleUsers[0],
    lastMessage: sampleMessages[2],
    unreadCount: 2,
    isActive: true
  },
  {
    id: '2',
    user: sampleUsers[1],
    lastMessage: sampleMessages[3],
    unreadCount: 1,
    isActive: false
  }
];

// Current user
export const currentUser: User = {
  id: 'current-user',
  name: 'John Doe',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzEwQjk4MSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5KPC90ZXh0Pjwvc3ZnPg==',
  status: 'online',
  location: 'Los Angeles, USA'
};
