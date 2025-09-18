import React, { useState } from 'react';
import ChatUI from './index';
import { sampleConversations, sampleMessages, currentUser } from './sampleData';
import { Message } from './types';

// Simple example usage of the ChatUI component
const ChatExample: React.FC = () => {
  const [conversations] = useState(sampleConversations);
  const [messages, setMessages] = useState(sampleMessages);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = (content: string, conversationId: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toISOString(),
      senderId: currentUser.id,
      conversationId,
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
        isLoading={isLoading}
        onConversationSelect={handleConversationSelect}
        onSendMessage={handleSendMessage}
      />
    </div>
  );
};

export default ChatExample;
