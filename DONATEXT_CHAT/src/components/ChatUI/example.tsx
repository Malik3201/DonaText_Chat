import React, { useState } from 'react';
import ChatUI from './index';
import { sampleConversations, sampleMessages, currentUser } from './sampleData';
import { Message } from './types';

// Example usage of the ChatUI component
const ChatExample: React.FC = () => {
  const [conversations] = useState(sampleConversations);
  const [messages, setMessages] = useState(sampleMessages);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('1');
  const [isLoading, setIsLoading] = useState(false);

  const handleConversationSelect = (conversationId: string) => {
    setSelectedConversationId(conversationId);
  };

  const handleSendMessage = (messageData: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...messageData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleFileUpload = (file: File, fileInfo: any, conversationId?: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: `Uploaded file: ${file.name}`,
      timestamp: new Date().toISOString(),
      senderId: currentUser.id,
      conversationId: conversationId || selectedConversationId,
      type: 'file',
      fileInfo,
    };

    setMessages(prev => [...prev, newMessage]);
  };

  const handleLoadMoreMessages = (conversationId: string) => {
    console.log('Load more messages for conversation:', conversationId);
    // Implement pagination logic here
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
        onLoadMoreMessages={handleLoadMoreMessages}
        showProfile={true}
        showWelcomeScreen={true}
      />
    </div>
  );
};

export default ChatExample;
