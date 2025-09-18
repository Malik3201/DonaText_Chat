import React, { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import chirs from '../../../src/assets/imgs/chris.png';
import { useSocket } from '../../contexts/socketContext';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchUserChats, fetchUserProfile } from '../../store/thunks/chatThunks';
import { useLocalStorageUser } from '../../utils';
import ChatProfile from './components/ChatProfile';
import ChatSidebar from './components/ChatSidebar';
import ChatWindow from './components/ChatWindow';
import { ChatConversation } from './types';

const ChatPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { conversationId } = useParams<{ conversationId: string }>();
  
  // Mobile responsive states
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Online status tracking
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  
  // Redux hooks
  const dispatch = useAppDispatch();
  const { userChats, isLoading, chatReceiverProfile } = useAppSelector(state => state.chat);
  
  // Get stored user from localStorage
  const storedUser = useLocalStorageUser();
  
  // Refs to prevent duplicate API calls
  const fetchedProfileRef = useRef<string | null>(null);
  const hasFetchedChatsRef = useRef(false);

  // Get socket from context
  const { socket } = useSocket();

  // Check if screen is mobile size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Listen for user status changes
  useEffect(() => {
    if (!socket) return;

    const handleUserStatusChange = (data: { userId: string; isOnline: boolean; timestamp: string }) => {
      setOnlineUsers(prev => ({
        ...prev,
        [data.userId]: data.isOnline
      }));
    };

    socket.on('user_status_change', handleUserStatusChange);

    return () => {
      socket.off('user_status_change', handleUserStatusChange);
    };
  }, [socket]);

  // Initialize online status from API data
  useEffect(() => {
    if (userChats.length > 0) {
      const initialOnlineStatus: Record<string, boolean> = {};
      
      userChats.forEach(chat => {
        chat.participants.forEach((participant: any) => {
          initialOnlineStatus[participant._id] = participant.isOnline || false;
        });
      });
      
      setOnlineUsers(prev => ({
        ...prev,
        ...initialOnlineStatus
      }));
    }
  }, [userChats]);

  // Get current user from stored user data or auth state
  const currentUser = storedUser ? {
    id: storedUser.user._id,
    name: `${(storedUser.user as any)?.firstName || ''} ${(storedUser.user as any)?.lastName || ''}`.trim() || 'User',
    avatar: (storedUser.user as any)?.profileImage || chirs,
    status: 'online' as const,
    location: storedUser.user.country,
  } : null;

  // Helper function to get user status
  const getUserStatus = (userId: string): 'online' | 'offline' => {
    return onlineUsers[userId] ? 'online' : 'offline';
  };

  // Convert API user chats to component format
  const convertUserChatsToConversations = (userChats: any[], currentUserId: string): ChatConversation[] => {
    if (!userChats || userChats.length === 0) {
      return [];
    }
    return userChats.map(chat => {
      // Find the other participant (not the current user) - now participants are objects
      const otherParticipant = chat.participants.find((participant: any) => participant._id !== currentUserId);
      
      return {
        id: chat._id,
        user: {
          id: otherParticipant?._id || 'unknown',
          name: otherParticipant ? `${otherParticipant.firstName || ''} ${otherParticipant.lastName || ''}`.trim() || 'Unknown User' : 'Unknown User',
          avatar: otherParticipant?.profileImage || chirs,
          status: getUserStatus(otherParticipant?._id || 'unknown'),
        },
        lastMessage: {
          id: chat.lastMessage._id,
          content: chat.lastMessage.content,
          timestamp: new Date(chat.lastMessage.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          senderId: chat.lastMessage.sender,
          type: 'text' as const,
        },
        unreadCount: 0, // You might want to calculate this based on readBy array
        isActive: selectedConversation === chat._id,
      };
    });
  };

  // Get receiver ID from selected conversation or URL params
  const getReceiverId = (): string | undefined => {
    // Get receiverUserId from search params (for direct URL access)
    const receiverUserId = searchParams.get('receiverUserId');
    if (receiverUserId) {
      return receiverUserId;
    }
    
    // Use the selected conversation's user ID directly
    if (selectedConv) {
      return selectedConv.user.id;
    }
    
    return undefined;
  };

  // Get selected conversation data
  const getSelectedConversation = (): ChatConversation | null => {
    if (!selectedConversation) return null;
    
    const conversations = convertUserChatsToConversations(userChats, currentUser?.id || '');
    return conversations.find(conv => conv.id === selectedConversation) || null;
  };

  // Create a new conversation object for new chats
  const createNewConversation = (receiverId: string): ChatConversation | null => {
    if (!chatReceiverProfile || !currentUser) return null;
    
    return {
      id: 'new', // Temporary ID for new conversations
      user: {
        id: receiverId,
        name: `${chatReceiverProfile.firstName || ''} ${chatReceiverProfile.lastName || ''}`.trim() || 'Unknown User',
        avatar: chatReceiverProfile.profileImage || chirs,
        status: getUserStatus(receiverId),
      },
      lastMessage: {
        id: 'temp',
        content: '',
        timestamp: '',
        senderId: '',
        type: 'text' as const,
      },
      unreadCount: 0,
      isActive: true,
    };
  };

  // Fetch user chats only once
  useEffect(() => {
    if (!hasFetchedChatsRef.current) {
      hasFetchedChatsRef.current = true;
      dispatch(fetchUserChats());
    }
  }, [dispatch]);

  // Set initial conversation based on URL parameters
  useEffect(() => {
    if (conversationId && userChats.length > 0) {
      // Find the chat with the conversationId from URL
      const existingChat = userChats.find(chat => chat._id === conversationId);
      
      if (existingChat) {
        setSelectedConversation(conversationId);
        // On mobile, close sidebar when conversation is selected
        if (isMobile) {
          setIsSidebarOpen(false);
        }
      }
    }
  }, [conversationId, userChats, isMobile]);

  // Fetch user profile when receiverUserId changes (only once per user)
  useEffect(() => {
    const receiverUserId = searchParams.get('receiverUserId');
    if (receiverUserId && receiverUserId !== fetchedProfileRef.current) {
      fetchedProfileRef.current = receiverUserId;
      dispatch(fetchUserProfile(receiverUserId));
    }
  }, [searchParams, dispatch]);

  // Handle conversation selection from sidebar
  const handleConversationSelect = (conversationId: string, receiverUserId: string) => {  
    setSelectedConversation(conversationId);
    
    // Update URL parameters
    const newSearchParams = new URLSearchParams();
    newSearchParams.set('receiverUserId', receiverUserId);
    
    // Navigate to the new URL with conversationId in path and receiverUserId in query
    navigate(`/chat/${conversationId}?${newSearchParams.toString()}`);
    
    // Fetch profile for the selected user if not already fetched
    if (receiverUserId && receiverUserId !== fetchedProfileRef.current) {
      fetchedProfileRef.current = receiverUserId;
      dispatch(fetchUserProfile(receiverUserId));
    }

    // On mobile, close sidebar when conversation is selected
    if (isMobile) {
      setIsSidebarOpen(false);
    }
  };

  const conversations = convertUserChatsToConversations(userChats, currentUser?.id || '');
  const selectedConv = getSelectedConversation();
  const receiverId = getReceiverId();
  
  // Check if we should show chat window (either existing conversation or new chat with receiver)
  const shouldShowChatWindow = selectedConv || (receiverId && chatReceiverProfile);
  
  // Get the conversation to pass to ChatWindow
  const conversationForChatWindow = selectedConv || (receiverId ? createNewConversation(receiverId) : null);

  return (
    <div className="flex h-screen bg-gray-100 relative">
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
          selectedConversation={selectedConversation}
          onConversationSelect={handleConversationSelect}
          isMobile={isMobile}
          onCloseSidebar={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {shouldShowChatWindow && conversationForChatWindow ? (
          <ChatWindow
            conversation={conversationForChatWindow}
            currentUser={currentUser}
            receiverId={receiverId}
            isMobile={isMobile}
            onOpenSidebar={() => setIsSidebarOpen(true)}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
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
            <div className="text-center px-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500 text-sm">
                {isMobile ? 'Tap the menu to choose a conversation' : 'Choose a conversation from the sidebar to start chatting'}
              </p>
              {isLoading && <p className="text-sm text-blue-500 mt-2">Loading conversations...</p>}
              {!isLoading && conversations.length === 0 && (
                <p className="text-sm text-gray-400 mt-2">No conversations found</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Profile Overlay */}
      {isMobile && isProfileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsProfileOpen(false)}
        />
      )}

      {/* Profile Sidebar */}
      <div className={`
        ${isMobile 
          ? `fixed inset-y-0 right-0 z-50 w-80 transform transition-transform duration-300 ease-in-out ${
              isProfileOpen ? 'translate-x-0' : 'translate-x-full'
            }`
          : 'w-80 hidden lg:block'
        } 
        border-l border-gray-200 bg-white
      `}>
        <ChatProfile 
          chatReceiverProfile={chatReceiverProfile} 
          isMobile={isMobile}
          onCloseProfile={() => setIsProfileOpen(false)}
        />
      </div>
    </div>
  );
};

export default ChatPage;  
