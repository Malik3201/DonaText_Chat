# DonaText Chat UI

A professional, modern React chat component with DonaText branding and styling. Clean, minimal design focused purely on UI with basic messaging functionality.

## ✨ Features

- 🎨 **DonaText Theme**: Professional blue gradient design with modern styling
- 📱 **Responsive**: Mobile-friendly layout with smooth animations
- 💬 **Clean Messaging**: Text-only chat functionality with message bubbles
- 👥 **Professional Sidebar**: Branded conversation list with online indicators
- ⚡ **Lightweight**: Only React + Tailwind CSS dependencies
- 🎯 **Props-based**: Easy integration with any backend
- 🔵 **Branded**: DonaText logo and color scheme throughout

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## 📖 Usage

```tsx
import ChatUI from './components/ChatUI';

function App() {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedConversationId, setSelectedConversationId] = useState('');

  const handleSendMessage = (content: string, conversationId: string) => {
    // Handle sending message to your backend
    console.log('Send message:', content, 'to conversation:', conversationId);
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

## 📋 Props

| Prop | Type | Description |
|------|------|-------------|
| `conversations` | `ChatConversation[]` | Array of conversations |
| `messages` | `Message[]` | Array of messages |
| `currentUser` | `User \| null` | Current user object |
| `selectedConversationId` | `string` | ID of selected conversation |
| `onConversationSelect` | `(id: string) => void` | Conversation selection handler |
| `onSendMessage` | `(content: string, conversationId: string) => void` | Message send handler |

## 📁 Component Structure

```
src/components/ChatUI/
├── index.tsx           # Main ChatUI component
├── types.ts            # TypeScript definitions
├── ChatSidebar.tsx     # Conversation sidebar
├── ChatWindow.tsx      # Chat messages and input
├── WelcomeScreen.tsx   # Empty state screen
├── LoadingScreen.tsx   # Loading state
├── sampleData.ts       # Sample data for demo
└── example.tsx         # Usage example
```

## 🎨 Customization

The component uses Tailwind CSS classes and can be easily customized:

```tsx
<ChatUI
  className="border-2 border-gray-300 rounded-lg"
  // ... other props
/>
```

## 📦 Integration

This component is designed to be copied into any React project:

1. Copy the `ChatUI` folder to your project
2. Install Tailwind CSS
3. Import and use the component

## 🔧 Dependencies

- **React 19+**
- **Tailwind CSS 3+**
- **TypeScript** (optional)

## 📄 License

Open source - use in any project.