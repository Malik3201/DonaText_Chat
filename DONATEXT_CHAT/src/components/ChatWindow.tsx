import React, { useEffect, useRef, useState } from 'react';
import FileIcon from '../assets/svgs/FileIcon';
import { Avatar, AvatarImage } from './ui/avatar';
import { ChatConversation, Message, User } from '../types';
import ChatFileUploadModal from './ChatFileUploadModal';
import { useSocket } from '../contexts/socketContext';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  sendChatMessage,
  fetchChatMessages, // Only one thunk now
  fetchUserChats, // Add this import
} from '../store/thunks/chatThunks';
import {
  clearError,
  clearSuccess,
  setCurrentChatId,
  setLoadingMore,
} from '../store/slices/chatSlice';

interface ChatWindowProps {
  conversation: ChatConversation;
  currentUser: any | null;
  receiverId?: string;
  isMobile?: boolean;
  onOpenSidebar?: () => void;
  onOpenProfile?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  currentUser,
  receiverId,
  isMobile = false,
  onOpenSidebar,
  onOpenProfile,
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    file: File;
    fileInfo: any;
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasLoadedInitialMessages, setHasLoadedInitialMessages] = useState(false);

  // Redux hooks
  const dispatch = useAppDispatch();
  const { isLoading, error, success, messages, currentChatId, pagination } =
    useAppSelector(state => state.chat);

  // Get socket from context
  const { socket } = useSocket();

  // Fetch messages when component mounts or conversation changes
  useEffect(() => {
    // Only fetch messages for existing conversations, not new ones
    if (conversation?.id && conversation.id !== 'new') {
      setHasLoadedInitialMessages(false);
      dispatch(fetchChatMessages({ 
        chatId: conversation.id,
        isLoadMore: false // Initial load
      })).then(() => {
        setHasLoadedInitialMessages(true);
        setShouldScrollToBottom(true);
      });
    } else if (conversation?.id === 'new') {
      // For new conversations, just set the initial state
      setHasLoadedInitialMessages(true);
      setShouldScrollToBottom(true);
    }
  }, [conversation?.id, dispatch]);

  // Listen for new messages via socket
  useEffect(() => {
    // Only listen for socket events for existing conversations
    if (!socket || !conversation?.id || conversation.id === 'new') {
      return;
    }

    // Create a unique handler function for this specific conversation
    const conversationId = conversation.id;
    const currentUserId = currentUser?.id;
    const currentReceiverId = receiverId;

    const handleNewMessage = (data: any) => {
      // Multiple validation checks
      const messageChatId = data.chatId || data.chat?._id;
      const messageSender = data.sender || data.senderId;
      const messageReceiver = data.receiver || data.receiverId;
      
      // Primary check: Message must belong to the current conversation
      const isCorrectChatId = messageChatId === conversationId;
      
      // Secondary check: Message must be for the current user
      const isForCurrentUser = messageReceiver === currentUserId;
      
      // Only process messages that belong to this specific conversation
      if (isCorrectChatId && isForCurrentUser) {
        // Refresh messages to get the latest including the new one
        dispatch(fetchChatMessages({ 
          chatId: conversationId,
          isLoadMore: false // Refresh is not pagination
        })).then(() => {
          // Auto-scroll to bottom when new message arrives
          setShouldScrollToBottom(true);
        });
      }
    };

    // Remove ALL existing new_message listeners first to prevent duplicates
    socket.removeAllListeners('new_message');
    
    // Add the new listener
    socket.on('new_message', handleNewMessage);

    // Cleanup
    return () => {
      socket.off('new_message', handleNewMessage);
    };
  }, [socket, conversation?.id, dispatch, currentUser?.id, receiverId]);

  const scrollToBottom = () => {
    if (messagesContainerRef.current && shouldScrollToBottom) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, shouldScrollToBottom]);

  // Load more messages when scrolling to top
  const handleLoadMoreMessages = async () => {
    // Don't load more messages for new conversations
    if (!conversation?.id || conversation.id === 'new' || isLoadingMore || !pagination.hasMore) return;

    setIsLoadingMore(true);
    dispatch(setLoadingMore(true));

    try {
      const nextPage = pagination.page + 1;
      const result = await dispatch(fetchChatMessages({ 
        chatId: conversation.id, 
        page: nextPage,
        isLoadMore: true // This is pagination
      }));

      if (fetchChatMessages.fulfilled.match(result)) {
        // Keep scroll position after loading more messages
        setShouldScrollToBottom(false);
      }
    } catch (error) {
      console.error('Failed to load more messages:', error);
    } finally {
      setIsLoadingMore(false);
      dispatch(setLoadingMore(false));
    }
  };

  // Handle scroll events for infinite scrolling
  const handleScroll = () => {
    if (!messagesContainerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    setShouldScrollToBottom(isNearBottom);

    // Load more messages when scrolling to top (only for existing conversations)
    if (scrollTop <= 100 && pagination.hasMore && !isLoadingMore && hasLoadedInitialMessages && conversation?.id !== 'new') {
      handleLoadMoreMessages();
    }
  };

  // Single function to handle both text and file messages
  const handleSendMessage = async () => {
    if (!currentUser) return;

    const textContent = newMessage.trim();
    const hasFile = !!uploadedFile;
    const hasText = !!textContent;

    // Prevent sending empty messages (no text & no file)
    if (!hasFile && !hasText) return;

    try {
      // Prepare payload for sendChatMessage API
      const payload: any = {
        // For new conversations, don't include chatId
        ...(conversation?.id && conversation.id !== 'new' && { chatId: conversation.id }),
        receiver: receiverId, // Receiver ID from conversation props
        ...(hasText && { content: textContent }), // include content only if text
        ...(hasFile && {
          fileUrl: uploadedFile!.fileInfo.url, // S3 URL from file upload
          fileName: uploadedFile!.fileInfo.name, // filename from file upload
        }),
      };

      // Dispatch the send message action
      const result = await dispatch(sendChatMessage(payload));

      // If successful, clear the input and file, and store chatId
      if (sendChatMessage.fulfilled.match(result)) {
        // Store the chatId from response for future messages
        if (result.payload?.chat?._id) {
          dispatch(setCurrentChatId(result.payload.chat._id));
        }

        // Clear inputs after successful send
        if (hasFile) {
          setUploadedFile(null);
        }
        if (hasText) {
          setNewMessage('');
        }
        setShouldScrollToBottom(true);

        // For new conversations, refresh messages and user chats list
        if (conversation?.id === 'new' && result.payload?.chat?._id) {
          // This is a new conversation, refresh both messages and user chats
          await Promise.all([
            dispatch(fetchChatMessages({ 
              chatId: result.payload.chat._id,
              isLoadMore: false // Refresh after sending
            })),
            dispatch(fetchUserChats()) // Refresh the sidebar with new conversation
          ]);
        } else if (conversation?.id && conversation.id !== 'new') {
          // Existing conversation, refresh messages
          dispatch(fetchChatMessages({ 
            chatId: conversation.id,
            isLoadMore: false // Refresh after sending
          }));
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleFileUpload = (file: any, fileInfo: any) => {
    setUploadedFile({ file, fileInfo });
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Convert API message to component message format
  const convertApiMessageToComponentMessage = (apiMessage: any): Message => {
    const isCurrentUser = apiMessage.sender === currentUser?.id;
    const hasContent = apiMessage.content && apiMessage.content.trim();
    const hasFile = apiMessage.fileUrl;

    // Determine message type based on content and file presence
    let messageType: 'text' | 'file' | 'mixed' = 'text';
    if (hasContent && hasFile) {
      messageType = 'mixed';
    } else if (hasFile) {
      messageType = 'file';
    }

    return {
      id: apiMessage._id,
      content: apiMessage.content,
      timestamp: new Date(apiMessage.createdAt).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      senderId: apiMessage.sender,
      type: messageType,
      fileInfo: apiMessage.fileUrl
        ? {
            name: apiMessage.fileName || 'File',
            type: 'File',
            size: 'Unknown',
            url: apiMessage.fileUrl,
          }
        : undefined,
    };
  };

  const renderMessage = (message: Message) => {
    const isCurrentUser = message.senderId === currentUser?.id;
    const senderName = isCurrentUser
      ? currentUser?.name
      : conversation.user.name;

    return (
      <div
        key={message.id}
        className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`${isMobile ? 'max-w-[280px]' : 'max-w-xs lg:max-w-md'} ${isCurrentUser ? 'order-2' : 'order-1'}`}
        >
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-xs text-gray-500">{senderName}</span>
            <span className="text-xs text-gray-400">{message.timestamp}</span>
          </div>

          <div
            className={`rounded-lg p-3 ${
              isCurrentUser
                ? 'bg-gray-100 text-gray-900'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {/* Render text content for text and mixed messages */}
            {(message.type === 'text' || message.type === 'mixed') && message.content && (
              <p className="text-sm mb-2">{message.content}</p>
            )}

            {/* Render file for file and mixed messages */}
            {(message.type === 'file' || message.type === 'mixed') && message.fileInfo && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{message.fileInfo.name}</p>
                  <p className="text-xs opacity-75">
                    {message.fileInfo.pages
                      ? `${message.fileInfo.pages} Pages • `
                      : ''}
                    {message.fileInfo.size}
                  </p>
                </div>
                <button className="text-xs opacity-75 hover:opacity-100">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Convert messages
  const convertedMessages = messages.map(convertApiMessageToComponentMessage);

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
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Mobile menu button */}
            {isMobile && (
              <button
                onClick={onOpenSidebar}
                className="p-2 hover:bg-gray-100 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
            
            <div className="relative">
              <Avatar className={`${isMobile ? 'h-8 w-8' : 'h-10 w-10'}`}>
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
            
            <div>
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold text-gray-900`}>
                {conversation.user.name}
              </h3>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {/* Profile button - desktop only or mobile profile button */}
            {!isMobile ? (
              <>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </button>
                <button className="p-2 text-gray-400 hover:text-gray-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                    />
                  </svg>
                </button>
              </>
            ) : (
              <button
                onClick={onOpenProfile}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-gray-50 hide-scrollbar"
        onScroll={handleScroll}
      >
        {/* Loading indicator for more messages */}
        {isLoadingMore && (
          <div className="flex justify-center py-4">
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm">Loading more messages...</span>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {convertedMessages.map(renderMessage)}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input Area - Top Section */}
      <div className="p-4 border-y-2 border-gray-200 bg-white">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Write a reply ..."
              className="w-full px-4 py-4 border-0 outline-none focus:ring-0 focus:outline-none rounded-lg text-base font-medium resize-none hide-scrollbar"
              rows={1}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={isLoading || (!newMessage.trim() && !uploadedFile)}
            className="w-12 h-12 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Action Bar - Bottom Section */}
      <div className="px-4 mt-2 pb-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFileUploadModal(true)}
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FileIcon />
            </button>
            <button
              disabled={isLoading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
          {!isMobile && (
            <button
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create an Offer
            </button>
          )}
        </div>
      </div>

      {/* File Preview - Below Action Bar */}
      {uploadedFile && (
        <div className="px-4 pb-4 bg-white border-t border-gray-200">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-100 rounded flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-red-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {uploadedFile.fileInfo.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {uploadedFile.fileInfo.type} • {uploadedFile.fileInfo.size}
                  </p>
                </div>
              </div>
              <button
                onClick={handleFileRemove}
                disabled={isLoading}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Upload Modal */}
      <ChatFileUploadModal
        isOpen={showFileUploadModal}
        onClose={() => setShowFileUploadModal(false)}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default ChatWindow;
