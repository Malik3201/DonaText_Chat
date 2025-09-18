import React, { useEffect, useRef, useState } from 'react';
import { ChatConversation, Message, User } from './types';

interface ChatWindowProps {
  conversation: ChatConversation;
  messages: Message[];
  currentUser: User | null;
  isMobile?: boolean;
  onSendMessage?: (content: string, conversationId: string) => void;
  onOpenSidebar?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUser,
  isMobile = false,
  onSendMessage,
  onOpenSidebar,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !onSendMessage) return;
    
    onSendMessage(newMessage.trim(), conversation.id);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === currentUser?.id;
    
    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-6`}
      >
        {!isCurrentUser && (
          <img 
            src={conversation.user.avatar} 
            alt={conversation.user.name}
            className="w-10 h-10 rounded-full object-cover mr-3 mt-1 ring-2 ring-gray-100"
          />
        )}
        
        <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-1' : 'order-2'}`}>
          <div
            className={`px-4 py-3 rounded-2xl shadow-sm ${
              isCurrentUser
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white'
                : 'bg-white text-gray-900 border border-gray-100'
            }`}
          >
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
          </div>
          <div className={`flex items-center mt-2 space-x-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
            <p className="text-xs text-gray-500 font-medium">
              {formatTimestamp(message.timestamp)}
            </p>
            {isCurrentUser && (
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
        
        {isCurrentUser && (
          <img 
            src={currentUser?.avatar} 
            alt={currentUser?.name}
            className="w-10 h-10 rounded-full object-cover ml-3 mt-1 ring-2 ring-blue-100"
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center space-x-4 p-6 border-b border-gray-100 bg-white shadow-sm">
        {isMobile && onOpenSidebar && (
          <button
            onClick={onOpenSidebar}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        )}
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <img 
              src={conversation.user.avatar} 
              alt={conversation.user.name}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100"
            />
            {conversation.user.status === 'online' && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-3 border-white rounded-full shadow-sm"></div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{conversation.user.name}</h2>
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${conversation.user.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></div>
              <p className="text-sm text-gray-600 font-medium">
                {conversation.user.status === 'online' ? 'Active now' : 'Offline'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="ml-auto flex items-center space-x-2">
          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-blue-50 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
        {messages.length === 0 ? (
          <div className="text-center mt-12">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg font-medium">Start your conversation</p>
            <p className="text-gray-500 text-sm mt-2">Send a message to begin chatting with {conversation.user.name}</p>
          </div>
        ) : (
          <>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-gray-100 bg-white">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium shadow-sm disabled:shadow-none"
          >
            <div className="flex items-center space-x-2">
              <span>Send</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
