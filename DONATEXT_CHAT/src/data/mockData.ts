import { ChatConversation, Message, User } from '../types';

// Mock users
export const mockUsers: User[] = [
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
  },
  {
    id: '3',
    name: 'Emma Wilson',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI0Y1OUUwQiIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FPC90ZXh0Pjwvc3ZnPg==',
    status: 'offline',
    title: 'Content Writer',
    rating: 4.7,
    responseTime: '~2 hours',
    location: 'London, UK',
    memberSince: '2023'
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iI0VGNDQ0NCIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5BPC90ZXh0Pjwvc3ZnPg==',
    status: 'online',
    title: 'Digital Marketer',
    rating: 4.6,
    responseTime: '~45 mins',
    location: 'Madrid, Spain',
    memberSince: '2022'
  },
  {
    id: '5',
    name: 'Lisa Park',
    avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzg4NTNGNCIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5MPC90ZXh0Pjwvc3ZnPg==',
    status: 'online',
    title: 'Graphic Designer',
    rating: 4.9,
    responseTime: '~20 mins',
    location: 'Seoul, South Korea',
    memberSince: '2021'
  }
];

// Mock messages
export const mockMessages: Record<string, Message[]> = {
  '1': [
    {
      id: 'msg1',
      content: 'Hi! I saw your project posting about the mobile app design. I\'d love to discuss how I can help you create an amazing user experience.',
      timestamp: '2024-01-15T10:30:00Z',
      senderId: '1',
      type: 'text'
    },
    {
      id: 'msg2',
      content: 'That sounds great! I\'m looking for someone who can create modern, clean designs with great UX principles.',
      timestamp: '2024-01-15T10:45:00Z',
      senderId: 'current-user',
      type: 'text'
    },
    {
      id: 'msg3',
      content: 'Perfect! I have 5+ years of experience in mobile app design. Here\'s my portfolio with similar projects.',
      timestamp: '2024-01-15T11:00:00Z',
      senderId: '1',
      type: 'file',
      fileInfo: {
        name: 'Sarah_Portfolio_2024.pdf',
        type: 'application/pdf',
        size: '2.4 MB',
        pages: 12
      }
    },
    {
      id: 'msg4',
      content: 'This looks impressive! I especially like the e-commerce app design. When would you be available to start?',
      timestamp: '2024-01-15T11:15:00Z',
      senderId: 'current-user',
      type: 'text'
    },
    {
      id: 'msg5',
      content: 'I can start next Monday. Here are some time slots we could discuss the project details:',
      timestamp: '2024-01-15T11:30:00Z',
      senderId: '1',
      type: 'calendar',
      calendarInfo: {
        title: 'Project Discussion',
        timeSlots: [
          { time: '9:00 AM - 10:00 AM', available: true },
          { time: '2:00 PM - 3:00 PM', available: true },
          { time: '4:00 PM - 5:00 PM', available: false }
        ]
      }
    }
  ],
  '2': [
    {
      id: 'msg6',
      content: 'Hello! I\'m interested in your React.js development project. I have extensive experience with React, Node.js, and MongoDB.',
      timestamp: '2024-01-14T14:20:00Z',
      senderId: '2',
      type: 'text'
    },
    {
      id: 'msg7',
      content: 'Great! Could you share some examples of your recent work?',
      timestamp: '2024-01-14T14:35:00Z',
      senderId: 'current-user',
      type: 'text'
    },
    {
      id: 'msg8',
      content: 'Absolutely! I recently built a real-time chat application and an e-commerce platform. Both are fully responsive and optimized.',
      timestamp: '2024-01-14T14:50:00Z',
      senderId: '2',
      type: 'text'
    }
  ],
  '3': [
    {
      id: 'msg9',
      content: 'Hi there! I specialize in creating engaging content for tech companies. I\'d love to help with your blog content needs.',
      timestamp: '2024-01-13T16:10:00Z',
      senderId: '3',
      type: 'text'
    },
    {
      id: 'msg10',
      content: 'That\'s exactly what I\'m looking for. Do you have experience with technical writing?',
      timestamp: '2024-01-13T16:25:00Z',
      senderId: 'current-user',
      type: 'text'
    }
  ],
  '4': [
    {
      id: 'msg11',
      content: 'I can help you increase your online presence with targeted digital marketing strategies. Let\'s discuss your goals!',
      timestamp: '2024-01-12T09:15:00Z',
      senderId: '4',
      type: 'text'
    }
  ],
  '5': [
    {
      id: 'msg12',
      content: 'Your brand identity project caught my attention. I create memorable visual identities that tell your story.',
      timestamp: '2024-01-11T13:40:00Z',
      senderId: '5',
      type: 'text'
    },
    {
      id: 'msg13',
      content: 'I love your design style! Could we schedule a call to discuss the project scope?',
      timestamp: '2024-01-11T14:00:00Z',
      senderId: 'current-user',
      type: 'text'
    },
    {
      id: 'msg14',
      content: 'Definitely! I\'m free this week. Here\'s my latest brand identity work:',
      timestamp: '2024-01-11T14:15:00Z',
      senderId: '5',
      type: 'file',
      fileInfo: {
        name: 'Brand_Identity_Showcase.zip',
        type: 'application/zip',
        size: '15.7 MB'
      }
    }
  ]
};

// Mock conversations
export const mockConversations: ChatConversation[] = mockUsers.map((user, index) => {
  const messages = mockMessages[user.id] || [];
  const lastMessage = messages[messages.length - 1] || {
    id: 'default',
    content: 'No messages yet',
    timestamp: new Date().toISOString(),
    senderId: user.id,
    type: 'text' as const
  };

  return {
    id: user.id,
    user,
    lastMessage,
    unreadCount: index === 0 ? 2 : index === 1 ? 1 : 0,
    isActive: index === 0
  };
});

// Current user mock data
export const mockCurrentUser = {
  id: 'current-user',
  name: 'John Doe',
  avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIyMCIgZmlsbD0iIzEwQjk4MSIvPjx0ZXh0IHg9IjIwIiB5PSIyNiIgZm9udC1mYW1pbHk9InNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5KPC90ZXh0Pjwvc3ZnPg==',
  status: 'online' as const,
  email: 'john.doe@example.com',
  location: 'Los Angeles, USA'
};
