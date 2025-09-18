import React from 'react';
import { ChatConversation } from './types';

interface ChatSidebarProps {
  conversations: ChatConversation[];
  selectedConversation: string | null;
  onConversationSelect: (conversationId: string) => void;
  isMobile?: boolean;
  onCloseSidebar?: () => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  conversations,
  selectedConversation,
  onConversationSelect,
  isMobile = false,
  onCloseSidebar,
}) => {
  const handleConversationClick = (conversationId: string) => {
    onConversationSelect(conversationId);
    if (isMobile && onCloseSidebar) {
      onCloseSidebar();
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex flex-col bg-white shadow-sm">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-600 to-blue-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white">DonaText Chat</h1>
              <p className="text-xs text-blue-100">Messages</p>
            </div>
          </div>
          {isMobile && onCloseSidebar && (
            <button
              onClick={onCloseSidebar}
              className="p-2 hover:bg-blue-500 hover:bg-opacity-20 rounded-lg text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No conversations yet</p>
            <p className="text-gray-400 text-xs mt-1">Start chatting with your contacts</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => handleConversationClick(conversation.id)}
                className={`p-4 hover:bg-blue-50 cursor-pointer transition-all duration-200 ${
                  selectedConversation === conversation.id 
                    ? 'bg-blue-50 border-r-3 border-blue-600 shadow-sm' 
                    : 'hover:shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="relative">
                    <img 
                      src={conversation.user.avatar} 
                      alt={conversation.user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                    />
                    {conversation.user.status === 'online' && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 border-2 border-white rounded-full shadow-sm"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className={`text-sm font-semibold truncate ${
                        selectedConversation === conversation.id ? 'text-blue-900' : 'text-gray-900'
                      }`}>
                        {conversation.user.name}
                      </h3>
                      {conversation.lastMessage && (
                        <span className="text-xs text-gray-500 font-medium">
                          {formatTimestamp(conversation.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conversation.lastMessage?.content || 'No messages yet'}
                      </p>
                      {conversation.unreadCount > 0 && (
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full shadow-sm">
                          {conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
          <span className="text-xs text-gray-600 font-medium">Online</span>
        </div>
      </div>
    </div>
  );
};

export default ChatSidebar;
