import { createAsyncThunk } from '@reduxjs/toolkit';
import { mockConversations, mockMessages, mockUsers } from '../../data/mockData';

// Mock API service - replace with your actual API calls
const mockApiDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchUserChats = createAsyncThunk(
  'chat/fetchUserChats',
  async (_, { rejectWithValue }) => {
    try {
      // Mock API call
      await mockApiDelay(800);
      
      // Return mock conversations data
      return mockConversations.map(conv => ({
        _id: conv.id,
        participants: [
          {
            _id: conv.user.id,
            firstName: conv.user.name.split(' ')[0],
            lastName: conv.user.name.split(' ')[1] || '',
            profileImage: conv.user.avatar,
            isOnline: conv.user.status === 'online',
            country: conv.user.location,
          }
        ],
        lastMessage: conv.lastMessage,
        unreadCount: conv.unreadCount,
        updatedAt: conv.lastMessage.timestamp,
      }));
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user chats');
    }
  }
);

export const fetchUserProfile = createAsyncThunk(
  'chat/fetchUserProfile',
  async (userId: string, { rejectWithValue }) => {
    try {
      // Mock API call
      await mockApiDelay(500);
      
      // Find user in mock data
      const user = mockUsers.find(u => u.id === userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Return mock user profile with additional details
      return {
        _id: user.id,
        firstName: user.name.split(' ')[0],
        lastName: user.name.split(' ')[1] || '',
        profileImage: user.avatar,
        isOnline: user.status === 'online',
        country: user.location,
        title: user.title,
        rating: user.rating,
        responseTime: user.responseTime,
        memberSince: user.memberSince,
        userSubscription: {
          plan: {
            subscriptionName: 'Pro Plan'
          }
        }
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user profile');
    }
  }
);

export const sendChatMessage = createAsyncThunk(
  'chat/sendChatMessage',
  async (messageData: any, { rejectWithValue }) => {
    try {
      // Mock API call
      await mockApiDelay(1000);
      
      const newMessage = {
        id: `msg-${Date.now()}`,
        content: messageData.content,
        timestamp: new Date().toISOString(),
        senderId: messageData.senderId,
        type: messageData.type || 'text',
        fileInfo: messageData.fileInfo,
      };

      // Add message to mock data for persistence during session
      const chatId = messageData.chatId || messageData.receiverId;
      if (mockMessages[chatId]) {
        mockMessages[chatId].push(newMessage);
      } else {
        mockMessages[chatId] = [newMessage];
      }
      
      return {
        message: newMessage,
        chat: {
          _id: chatId,
        },
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to send message');
    }
  }
);

export const fetchChatMessages = createAsyncThunk(
  'chat/fetchChatMessages',
  async ({ chatId, isLoadMore = false }: { chatId: string; isLoadMore?: boolean }, { rejectWithValue }) => {
    try {
      // Mock API call
      await mockApiDelay(600);
      
      // Get messages for this chat
      const messages = mockMessages[chatId] || [];
      
      return {
        messages: messages.map(msg => ({
          _id: msg.id,
          content: msg.content,
          timestamp: msg.timestamp,
          sender: { _id: msg.senderId },
          messageType: msg.type,
          fileInfo: msg.fileInfo,
          calendarInfo: msg.calendarInfo,
        })),
        pagination: {
          currentPage: 1,
          hasMore: false,
          totalPages: 1,
        },
        isLoadMore,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch chat messages');
    }
  }
);
