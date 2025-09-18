import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchUserChats, fetchUserProfile, sendChatMessage, fetchChatMessages } from '../thunks/chatThunks';

interface ChatState {
  userChats: any[];
  chatReceiverProfile: any | null;
  messages: any[];
  currentChatId: string | null;
  pagination: {
    currentPage: number;
    hasMore: boolean;
    totalPages: number;
  };
  isLoading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ChatState = {
  userChats: [],
  chatReceiverProfile: null,
  messages: [],
  currentChatId: null,
  pagination: {
    currentPage: 1,
    hasMore: false,
    totalPages: 1,
  },
  isLoading: false,
  error: null,
  success: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentChatId: (state, action: PayloadAction<string>) => {
      state.currentChatId = action.payload;
    },
    setLoadingMore: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addMessage: (state, action: PayloadAction<any>) => {
      state.messages.push(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user chats
      .addCase(fetchUserChats.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserChats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userChats = action.payload || [];
      })
      .addCase(fetchUserChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch user profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chatReceiverProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Send chat message
      .addCase(sendChatMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendChatMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.success = 'Message sent successfully';
        if (action.payload?.message) {
          state.messages.push(action.payload.message);
        }
      })
      .addCase(sendChatMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch chat messages
      .addCase(fetchChatMessages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        state.isLoading = false;
        const { messages, pagination, isLoadMore } = action.payload;
        
        if (isLoadMore) {
          // Prepend older messages for load more
          state.messages = [...messages, ...state.messages];
        } else {
          // Replace messages for initial load or refresh
          state.messages = messages || [];
        }
        
        state.pagination = pagination || initialState.pagination;
      })
      .addCase(fetchChatMessages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, setCurrentChatId, setLoadingMore, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
