import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarImage } from './ui/avatar';
import { ChatConversation, Message, User } from './types';
import FileIcon from './FileIcon';

interface ChatWindowProps {
  conversation: ChatConversation;
  messages: Message[];
  currentUser: User | null;
  isMobile?: boolean;
  onSendMessage?: (content: string, type?: 'text' | 'file', fileInfo?: any) => void;
  onFileUpload?: (file: File, fileInfo: any) => void;
  onLoadMoreMessages?: () => void;
  onOpenSidebar?: () => void;
  onOpenProfile?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUser,
  isMobile = false,
  onSendMessage,
  onFileUpload,
  onLoadMoreMessages,
  onOpenSidebar,
  onOpenProfile,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !onSendMessage) return;
    
    onSendMessage(newMessage.trim());
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onFileUpload) return;

    const fileInfo = {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    };

    onFileUpload(file, fileInfo);
    e.target.value = ''; // Reset input
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
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        {!isCurrentUser && (
          <Avatar className="w-8 h-8 mr-2 mt-1">
            <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
          </Avatar>
        )}
        
        <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-1' : 'order-2'}`}>
          <div
            className={`px-4 py-2 rounded-lg ${
              isCurrentUser
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-900'
            }`}
          >
            {message.type === 'file' && message.fileInfo ? (
              <div className="flex items-center space-x-2">
                <FileIcon className="w-5 h-5" />
                <div>
                  <p className="font-medium">{message.fileInfo.name}</p>
                  <p className="text-xs opacity-75">{message.fileInfo.size}</p>
                </div>
              </div>
            ) : message.type === 'calendar' && message.calendarInfo ? (
              <div>
                <p className="font-medium mb-2">{message.calendarInfo.title}</p>
                <div className="space-y-1">
                  {message.calendarInfo.timeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`text-xs px-2 py-1 rounded ${
                        slot.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {slot.time} - {slot.available ? 'Available' : 'Unavailable'}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
          </div>
          <p className={`text-xs mt-1 ${isCurrentUser ? 'text-right' : 'text-left'} text-gray-500`}>
            {formatTimestamp(message.timestamp)}
          </p>
        </div>
        
        {isCurrentUser && (
          <Avatar className="w-8 h-8 ml-2 mt-1">
            <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
          </Avatar>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          {isMobile && onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          
          <div 
            className="flex items-center space-x-3 cursor-pointer"
            onClick={onOpenProfile}
          >
            <div className="relative">
              <Avatar className="w-10 h-10">
                <AvatarImage src={conversation.user.avatar} alt={conversation.user.name} />
              </Avatar>
              {conversation.user.status === 'online' && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              )}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">{conversation.user.name}</h2>
              <p className="text-sm text-gray-500">
                {conversation.user.status === 'online' ? 'Online' : 'Offline'}
                {conversation.user.title && ` • ${conversation.user.title}`}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          <>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <div className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={1}
              style={{
                minHeight: '40px',
                maxHeight: '120px',
                height: 'auto',
              }}
            />
          </div>
          
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Attach file"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="*/*"
        />
      </div>
    </div>
  );
};

export default ChatWindow;
