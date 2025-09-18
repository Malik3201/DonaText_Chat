import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import ChatProfile from './ChatProfile';
import WelcomeScreen from './WelcomeScreen';
import LoadingScreen from './LoadingScreen';
import { ChatUIProps, ChatConversation, Message, User } from './types';

const ChatUI: React.FC<ChatUIProps> = ({
  conversations = [],
  messages = [],
  currentUser,
  selectedConversationId,
  isLoading = false,
  onConversationSelect,
  onSendMessage,
  onFileUpload,
  onLoadMoreMessages,
  className = '',
  showProfile = true,
  showWelcomeScreen = true,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Find selected conversation
  const selectedConversation = conversations.find(
    conv => conv.id === selectedConversationId
  );

  // Get messages for selected conversation
  const conversationMessages = messages.filter(
    msg => msg.conversationId === selectedConversationId
  );

  const handleConversationSelect = (conversationId: string) => {
    onConversationSelect?.(conversationId);
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const handleSendMessage = (content: string, type: 'text' | 'file' = 'text', fileInfo?: any) => {
    if (!selectedConversationId || !currentUser) return;

    const newMessage: Omit<Message, 'id' | 'timestamp'> = {
      content,
      senderId: currentUser.id,
      conversationId: selectedConversationId,
      type,
      fileInfo,
    };

    onSendMessage?.(newMessage);
  };

  const handleFileUpload = (file: File, fileInfo: any) => {
    onFileUpload?.(file, fileInfo, selectedConversationId);
  };

  // Show loading screen if specified
  if (isLoading && conversations.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className={`flex h-screen bg-gray-100 relative ${className}`}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${
              isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'w-80'
        } 
        border-r border-gray-200 bg-white
      `}>
        <ChatSidebar
          conversations={conversations}
          selectedConversation={selectedConversationId}
          onConversationSelect={handleConversationSelect}
          isMobile={isMobile}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConversation ? (
          <ChatWindow
            conversation={selectedConversation}
            messages={conversationMessages}
            currentUser={currentUser}
            isMobile={isMobile}
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            onLoadMoreMessages={() => onLoadMoreMessages?.(selectedConversationId)}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        ) : (
          <div className="relative flex-1">
            {/* Mobile menu button when no conversation selected */}
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-4 left-4 z-30 p-2 bg-white rounded-lg shadow-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            {showWelcomeScreen && <WelcomeScreen />}
          </div>
        )}
      </div>

      {/* Profile Panel */}
      {showProfile && selectedConversation && (
        <>
          {/* Mobile Profile Overlay */}
          {isMobile && isProfileOpen && (
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 z-40"
              onClick={() => setIsProfileOpen(false)}
            />
          )}

          <div className={`
            ${isMobile 
              ? `fixed inset-y-0 right-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${
                  isProfileOpen ? 'translate-x-0' : 'translate-x-full'
                }`
              : 'w-80'
            } 
            border-l border-gray-200 bg-white
          `}>
            <ChatProfile
              user={selectedConversation.user}
              isMobile={isMobile}
              onCloseProfile={() => setIsProfileOpen(false)}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ChatUI;
