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

const savedChatData = localStorage.getItem("chatData-unstructure");
if (savedChatData) {
  initialChatState.value = JSON.parse(savedChatData);
}

const chatSlice = createSlice({
  name: "unStructureChat",
  initialState: initialChatState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.value.push(action.payload);
      localStorage.setItem("chatData-unstructure", JSON.stringify(state.value));
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        chatId: number;
        result: { result: any; query: string };
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
              result: result.result,
              query: result.query,
              analytics: null,
            },
          };
        }
        return item;
      });
      localStorage.setItem("chatData-unstructure", JSON.stringify(state.value));
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
      localStorage.setItem("chatData-unstructure", JSON.stringify(state.value));
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
      localStorage.setItem("chatData-unstructure", JSON.stringify(state.value));
    },
  },
});

export const { addMessage, updateMessage, addAnalitics, updateResult } =
  chatSlice.actions;
export default chatSlice.reducer;
