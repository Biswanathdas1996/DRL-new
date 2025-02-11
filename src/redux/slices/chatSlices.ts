import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Analitics } from "../../types/LLM";

interface ChatMessage {
  id: number;
  type: string;
  message: string | object;
  time: string;
}

export interface ChatState {
  value: ChatMessage[];
}

const initialChatState: ChatState = {
  value: [],
};

const savedChatData = localStorage.getItem("chatData");
if (savedChatData) {
  initialChatState.value = JSON.parse(savedChatData);
}

const chatSlice = createSlice({
  name: "chat",
  initialState: initialChatState,
  reducers: {
    deleteMessage: (state, action: PayloadAction<number>) => {
      const chatId = action.payload;
      state.value = state.value.filter((item) => item.id !== chatId);
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.value.push(action.payload);
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        chatId: number;
        result: { result: any; query: string; type: string };
        llmReply?: any;
      }>
    ) => {
      const { chatId, result, llmReply } = action.payload;
      state.value = state.value.map((item) => {
        if (item.id === chatId) {
          return {
            ...item,
            message: {
              ...(typeof item.message === "object" && item.message !== null
                ? item.message
                : {}),
              result: result.result,
              query: result.query,
              type: result.type,
              analytics: null,
              llmReply: llmReply,
            },
          };
        }
        return item;
      });
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },
    addAnalitics: (
      state,
      action: PayloadAction<{
        chatId: number;
        analytics: Analitics[];
      }>
    ) => {
      const { chatId, analytics } = action.payload;
      state.value = state.value.map((item) => {
        if (item.id === chatId) {
          return {
            ...item,
            message: {
              ...(typeof item.message === "object" && item.message !== null
                ? item.message
                : {}),
              analytics: analytics,
            },
          };
        }
        return item;
      });
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },
    addLLMReply: (
      state,
      action: PayloadAction<{
        chatId: number;
        llmReply: any;
      }>
    ) => {
      const { chatId, llmReply } = action.payload;
      state.value = state.value.map((item) => {
        if (item.id === chatId) {
          return {
            ...item,
            message: {
              ...(typeof item.message === "object" && item.message !== null
                ? item.message
                : {}),
              llmReply: llmReply,
            },
          };
        }
        return item;
      });
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },
    updateResult: (
      state,
      action: PayloadAction<{
        chatId: number;
        result: any;
      }>
    ) => {
      const { chatId, result } = action.payload;
      state.value = state.value.map((item) => {
        if (item.id === chatId) {
          return {
            ...item,
            message: {
              ...(typeof item.message === "object" && item.message !== null
                ? item.message
                : {}),
              result: result,
              analytics: null,
            },
          };
        }
        return item;
      });
      localStorage.setItem("chatData", JSON.stringify(state.value));
    },

    getMessageById: (state, action: PayloadAction<number>) => {
      const chatId = action.payload;
      const message = state.value.find((item) => item.id === chatId);
      return {
        ...state,
        selectedMessage: message,
      };
    },
    clearChat: (state) => {
      state.value = [];
      localStorage.removeItem("chatData");
    },
  },
});

export const {
  addMessage,
  updateMessage,
  addAnalitics,
  updateResult,
  addLLMReply,
  getMessageById,
  clearChat,
  deleteMessage,
} = chatSlice.actions;
export default chatSlice.reducer;
