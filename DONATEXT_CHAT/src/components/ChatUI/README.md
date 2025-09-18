# ChatUI Component

A standalone, lightweight React chat component that can be easily integrated into any React project. No Redux, WebSockets, or heavy dependencies required.

## Features

- 🎨 **Beautiful UI**: Modern, responsive design with Tailwind CSS
- 📱 **Mobile Responsive**: Fully responsive with mobile-optimized layout
- 💬 **Message Types**: Support for text, file, and calendar messages
- 👤 **User Profiles**: Integrated user profile panel with ratings and details
- 🔍 **Search**: Built-in conversation search functionality
- ⚡ **Lightweight**: No external state management or WebSocket dependencies
- 🎯 **Props-based**: Simple props-based API for easy integration

## Installation

1. Copy the `ChatUI` folder to your React project
2. Make sure you have Tailwind CSS installed and configured
3. Import and use the component

## Quick Start

```tsx
import React, { useState } from 'react';
import ChatUI from './components/ChatUI';
import { sampleConversations, sampleMessages, currentUser } from './components/ChatUI/sampleData';

function App() {
  const [conversations] = useState(sampleConversations);
  const [messages, setMessages] = useState(sampleMessages);
  const [selectedConversationId, setSelectedConversationId] = useState('1');

  const handleSendMessage = (messageData) => {
    const newMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="h-screen">
      <ChatUI
        conversations={conversations}
        messages={messages}
        currentUser={currentUser}
        selectedConversationId={selectedConversationId}
        onConversationSelect={setSelectedConversationId}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
```

## Props API

### ChatUIProps

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `conversations` | `ChatConversation[]` | ✅ | Array of conversations to display |
| `messages` | `Message[]` | ✅ | Array of messages for all conversations |
| `currentUser` | `User \| null` | ✅ | Current logged-in user |
| `selectedConversationId` | `string` | ❌ | ID of currently selected conversation |
| `isLoading` | `boolean` | ❌ | Show loading screen |
| `onConversationSelect` | `(id: string) => void` | ❌ | Called when conversation is selected |
| `onSendMessage` | `(message) => void` | ❌ | Called when message is sent |
| `onFileUpload` | `(file, fileInfo, conversationId) => void` | ❌ | Called when file is uploaded |
| `onLoadMoreMessages` | `(conversationId: string) => void` | ❌ | Called to load more messages |
| `className` | `string` | ❌ | Additional CSS classes |
| `showProfile` | `boolean` | ❌ | Show/hide profile panel (default: true) |
| `showWelcomeScreen` | `boolean` | ❌ | Show/hide welcome screen (default: true) |

## Data Types

### User
```tsx
interface User {
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
```

### Message
```tsx
interface Message {
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
```

### ChatConversation
```tsx
interface ChatConversation {
  id: string;
  user: User;
  lastMessage?: Message;
  unreadCount: number;
  isActive?: boolean;
}
```

## Integration with Different Backends

### REST API Integration
```tsx
const handleSendMessage = async (messageData) => {
  try {
    const response = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(messageData)
    });
    
    const newMessage = await response.json();
    setMessages(prev => [...prev, newMessage]);
  } catch (error) {
    console.error('Failed to send message:', error);
  }
};
```

### WebSocket Integration
```tsx
useEffect(() => {
  const ws = new WebSocket('ws://localhost:8080');
  
  ws.onmessage = (event) => {
    const newMessage = JSON.parse(event.data);
    setMessages(prev => [...prev, newMessage]);
  };

  return () => ws.close();
}, []);

const handleSendMessage = (messageData) => {
  ws.send(JSON.stringify(messageData));
};
```

### Firebase Integration
```tsx
import { addDoc, collection, onSnapshot } from 'firebase/firestore';

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, 'messages'),
    (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMessages(newMessages);
    }
  );

  return unsubscribe;
}, []);

const handleSendMessage = async (messageData) => {
  await addDoc(collection(db, 'messages'), messageData);
};
```

## Styling Customization

The component uses Tailwind CSS classes. You can customize the appearance by:

1. **Overriding Tailwind classes**: Pass custom `className` prop
2. **Modifying component files**: Edit the component files directly
3. **CSS custom properties**: Use CSS variables for colors and spacing

## File Structure

```
ChatUI/
├── index.tsx              # Main ChatUI component
├── types.ts               # TypeScript type definitions
├── ChatSidebar.tsx        # Conversation list sidebar
├── ChatWindow.tsx         # Main chat window
├── ChatProfile.tsx        # User profile panel
├── WelcomeScreen.tsx      # Welcome/empty state screen
├── LoadingScreen.tsx      # Loading state screen
├── FileIcon.tsx           # File icon component
├── sampleData.ts          # Sample data for testing
├── example.tsx            # Usage example
├── ui/
│   └── avatar.tsx         # Avatar component
└── README.md              # This file
```

## Dependencies

- React 16.8+
- Tailwind CSS
- TypeScript (optional but recommended)

## License

This component is provided as-is for integration into your projects.
