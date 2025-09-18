import React, { useState, useEffect } from 'react';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import WelcomeScreen from './WelcomeScreen';
import LoadingScreen from './LoadingScreen';
import { ChatUIProps } from './types';

const ChatUI: React.FC<ChatUIProps> = ({
  conversations = [],
  messages = [],
  currentUser,
  selectedConversationId,
  isLoading = false,
  onConversationSelect,
  onSendMessage,
  className = '',
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Show loading screen if specified
  if (isLoading && conversations.length === 0) {
    return <LoadingScreen />;
  }

  return (
    <div className={`flex h-screen bg-gradient-to-br from-gray-50 to-blue-50 relative ${className}`}>
      {/* Mobile Sidebar Overlay */}
      {isMobile && isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 backdrop-blur-sm"
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
        border-r border-gray-100 shadow-lg
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
          <div className="h-full bg-white rounded-tl-2xl shadow-lg overflow-hidden">
            <ChatWindow
              conversation={selectedConversation}
              messages={conversationMessages}
              currentUser={currentUser}
              isMobile={isMobile}
              onSendMessage={onSendMessage}
              onOpenSidebar={() => setIsSidebarOpen(true)}
            />
          </div>
        ) : (
          <div className="relative flex-1">
            {/* Mobile menu button when no conversation selected */}
            {isMobile && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="fixed top-6 left-6 z-30 p-3 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-200"
              >
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            <WelcomeScreen />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUI;
