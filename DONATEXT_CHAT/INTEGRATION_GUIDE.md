# ChatUI Integration Guide

This guide shows you how to integrate the standalone ChatUI component into your existing React project.

## 🚀 Quick Integration Steps

### 1. Copy the Component Files

Copy the entire `src/components/ChatUI` folder to your project:

```
your-project/
├── src/
│   ├── components/
│   │   └── ChatUI/          # ← Copy this entire folder
│   │       ├── index.tsx
│   │       ├── types.ts
│   │       ├── ChatSidebar.tsx
│   │       ├── ChatWindow.tsx
│   │       ├── ChatProfile.tsx
│   │       ├── WelcomeScreen.tsx
│   │       ├── LoadingScreen.tsx
│   │       ├── FileIcon.tsx
│   │       ├── sampleData.ts
│   │       ├── example.tsx
│   │       └── ui/
│   │           └── avatar.tsx
│   └── ...
```

### 2. Install Required Dependencies

Make sure you have these dependencies installed:

```bash
npm install react react-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 3. Configure Tailwind CSS

Update your `tailwind.config.js`:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

Add Tailwind to your CSS file (e.g., `src/index.css`):

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Basic Usage

```tsx
import React, { useState } from 'react';
import ChatUI from './components/ChatUI';
import { sampleConversations, sampleMessages, currentUser } from './components/ChatUI/sampleData';

function App() {
  const [conversations, setConversations] = useState(sampleConversations);
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

export default App;
```

## 🔧 Advanced Integration Examples

### With Your Own State Management

```tsx
import React, { useState, useEffect } from 'react';
import ChatUI from './components/ChatUI';
import { User, Message, ChatConversation } from './components/ChatUI/types';

function ChatContainer() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from your API
  useEffect(() => {
    loadConversations();
    loadCurrentUser();
  }, []);

  const loadConversations = async () => {
    try {
      const response = await fetch('/api/conversations');
      const data = await response.json();
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const response = await fetch(\`/api/conversations/\${conversationId}/messages\`);
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const loadCurrentUser = async () => {
    try {
      const response = await fetch('/api/user/me');
      const user = await response.json();
      setCurrentUser(user);
    } catch (error) {
      console.error('Failed to load user:', error);
    }
  };

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    loadMessages(conversationId);
  };

  const handleSendMessage = async (messageData: Omit<Message, 'id' | 'timestamp'>) => {
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

  const handleFileUpload = async (file: File, fileInfo: any, conversationId?: string) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversationId', conversationId || selectedConversationId || '');
      
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData
      });
      
      const result = await response.json();
      
      // Send message with file info
      handleSendMessage({
        content: \`Uploaded file: \${file.name}\`,
        senderId: currentUser?.id || '',
        conversationId: conversationId || selectedConversationId || '',
        type: 'file',
        fileInfo: {
          ...fileInfo,
          url: result.url
        }
      });
    } catch (error) {
      console.error('Failed to upload file:', error);
    }
  };

  return (
    <div className="h-screen">
      <ChatUI
        conversations={conversations}
        messages={messages}
        currentUser={currentUser}
        selectedConversationId={selectedConversationId}
        isLoading={isLoading}
        onConversationSelect={handleConversationSelect}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
}
```

### With WebSocket Real-time Updates

```tsx
import React, { useState, useEffect, useRef } from 'react';
import ChatUI from './components/ChatUI';
import { Message } from './components/ChatUI/types';

function RealTimeChatContainer() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string>();
  const [currentUser, setCurrentUser] = useState(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    wsRef.current = new WebSocket('ws://localhost:8080');
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'new_message':
          setMessages(prev => [...prev, data.message]);
          break;
        case 'user_online':
          updateUserStatus(data.userId, 'online');
          break;
        case 'user_offline':
          updateUserStatus(data.userId, 'offline');
          break;
      }
    };

    wsRef.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const updateUserStatus = (userId: string, status: 'online' | 'offline') => {
    setConversations(prev => 
      prev.map(conv => 
        conv.user.id === userId 
          ? { ...conv, user: { ...conv.user, status } }
          : conv
      )
    );
  };

  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    // Send via WebSocket
    wsRef.current?.send(JSON.stringify({
      type: 'send_message',
      message: newMessage
    }));

    // Optimistically add to local state
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <ChatUI
      conversations={conversations}
      messages={messages}
      currentUser={currentUser}
      selectedConversationId={selectedConversationId}
      onConversationSelect={setSelectedConversationId}
      onSendMessage={handleSendMessage}
    />
  );
}
```

### With Context API for Global State

```tsx
// ChatContext.tsx
import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ChatConversation, Message, User } from './components/ChatUI/types';

interface ChatState {
  conversations: ChatConversation[];
  messages: Message[];
  currentUser: User | null;
  selectedConversationId?: string;
  isLoading: boolean;
}

type ChatAction = 
  | { type: 'SET_CONVERSATIONS'; payload: ChatConversation[] }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_CURRENT_USER'; payload: User }
  | { type: 'SELECT_CONVERSATION'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean };

const initialState: ChatState = {
  conversations: [],
  messages: [],
  currentUser: null,
  isLoading: false,
};

const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'SET_CONVERSATIONS':
      return { ...state, conversations: action.payload };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    case 'SELECT_CONVERSATION':
      return { ...state, selectedConversationId: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const ChatContext = createContext<{
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
} | null>(null);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);

  return (
    <ChatContext.Provider value={{ state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

// Usage in component
function ChatWithContext() {
  const { state, dispatch } = useChat();

  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: newMessage });
  };

  return (
    <ChatUI
      conversations={state.conversations}
      messages={state.messages}
      currentUser={state.currentUser}
      selectedConversationId={state.selectedConversationId}
      isLoading={state.isLoading}
      onConversationSelect={(id) => dispatch({ type: 'SELECT_CONVERSATION', payload: id })}
      onSendMessage={handleSendMessage}
    />
  );
}
```

## 🎨 Customization Options

### Custom Styling

```tsx
// Custom CSS classes
<ChatUI
  className="border-2 border-gray-300 rounded-lg shadow-lg"
  conversations={conversations}
  messages={messages}
  currentUser={currentUser}
/>
```

### Hide/Show Features

```tsx
<ChatUI
  showProfile={false}        // Hide profile panel
  showWelcomeScreen={false}   // Hide welcome screen
  conversations={conversations}
  messages={messages}
  currentUser={currentUser}
/>
```

### Custom Message Rendering

You can modify the `ChatWindow.tsx` file to add custom message types or styling.

## 🔧 Troubleshooting

### Common Issues

1. **Tailwind styles not working**: Make sure Tailwind CSS is properly installed and configured
2. **TypeScript errors**: Install `@types/react` and `@types/react-dom`
3. **Component not rendering**: Check that all required props are provided

### Performance Optimization

```tsx
// Memoize components for better performance
import React, { memo } from 'react';

const OptimizedChatUI = memo(ChatUI);

// Use callback hooks for event handlers
const handleSendMessage = useCallback((messageData) => {
  // Handle message
}, []);
```

## 📦 Building for Production

The component is ready for production use. Make sure to:

1. Optimize bundle size by removing unused Tailwind classes
2. Implement proper error handling
3. Add loading states for better UX
4. Test on different screen sizes

## 🤝 Support

If you encounter any issues during integration, check:

1. Console for JavaScript errors
2. Network tab for API call failures
3. React DevTools for component state
4. Tailwind CSS compilation

For additional customization or advanced features, you can modify the component files directly to fit your specific needs.
