import React, { useState } from 'react';
import { Avatar, AvatarImage } from '../../../components/ui/avatar';
import { ChatConversation, User } from '../types';
import { useLocalStorageUser } from '../../../utils';

interface ChatSidebarProps {
  conversations: ChatConversation[];
  selectedConversation: string | null;
  onConversationSelect: (conversationId: string, receiverUserId: string) => void;
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
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('All messages');

  const filteredConversations = conversations.filter(conv =>
    conv.user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleConversationClick = (conversationId: string, receiverUserId: string) => {
    onConversationSelect(conversationId, receiverUserId);
    // Close sidebar on mobile after selection
    if (isMobile && onCloseSidebar) {
      onCloseSidebar();
    }
  };

  const renderStarIcon = (conversation: ChatConversation) => {
    // Show star for specific conversations based on the image
    const starredConversations = ['2', '3', '8', '10']; // IDs that should show stars
    if (starredConversations.includes(conversation.id)) {
      return (
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      );
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header with mobile close button */}
      <div className="p-4 border-b border-gray-200">
        {/* Mobile header */}
        {isMobile && (
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Messages</h2>
            <button
              onClick={onCloseSidebar}
              className="p-1 rounded-md hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Search and Filter Row */}
        <div className="flex space-x-3">
          {/* Search Bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search messages"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Dropdown - Hide on mobile to save space */}
          {!isMobile && (
            <div className="relative">
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="block px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white min-w-[120px]"
              >
                <option value="All messages">All messages</option>
                <option value="Unread">Unread</option>
                <option value="Starred">Starred</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map(conversation => (
          <div
            key={conversation.id}
            onClick={() => handleConversationClick(conversation.id, conversation.user.id)}
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              selectedConversation === conversation.id
                ? 'bg-blue-50 border-l-4 border-l-blue-500'
                : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <Avatar className={`${isMobile ? 'h-10 w-10' : 'h-12 w-12'}`}>
                  <AvatarImage
                    src={conversation.user.avatar}
                    alt={conversation.user.name}
                    className="object-cover"
                  />
                </Avatar>
                {/* Real-time online status indicator */}
                <div className={`absolute -bottom-1 -right-1 w-3 h-3 ${getStatusColor(conversation.user.status)} border-2 border-white rounded-full transition-colors duration-200`}>
                  {/* Add a subtle pulse animation for online users */}
                  {conversation.user.status === 'online' && (
                    <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={`${isMobile ? 'text-sm' : 'text-sm'} font-semibold text-gray-900 truncate`}>
                    {conversation.user.name}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500 flex-shrink-0">
                      {conversation.lastMessage.timestamp}
                    </span>
                    {renderStarIcon(conversation)}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 flex-1 min-w-0">
                    <p
                      className={`text-sm truncate flex-1 ${
                        conversation.lastMessage.content === 'Typing...'
                          ? 'text-blue-500 italic'
                          : 'text-gray-600'
                      }`}
                    >
                      {conversation.lastMessage.content}
                    </p>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
