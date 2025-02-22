import { useState, useEffect } from "react";
import { dbSchema } from "../string/dbSchema";

interface Chat {
  type: string;
  message?: string | Object;
  query?: string;
}

interface ChatContext {
  role: string;
  content: string;
}

const useChatContext = (chatHistory: Chat[]) => {
  const [chatContext, setChatContext] = useState<ChatContext[]>([]);

  useEffect(() => {
    // const slicedChatHistory = chatHistory.slice(-8);
    const mappedChatContext = chatHistory.map((chat: Chat) => ({
      role: chat.type === "user" ? "user" : "assistant",
      content:
        chat.type === "user"
          ? String(chat.message ?? "")
          : typeof chat.message === "object" && "query" in chat.message
          ? String(chat.message.query)
          : "",
    }));

    const lastSystemMessage = mappedChatContext
      .filter((chat) => chat.role === "assistant" && chat.content)
      .slice(-1)[0];

    const userMessages = mappedChatContext.filter(
      (chat) => chat.role === "user"
    );

    const systemMessages = {
      role: "system",
      content: `
      You are an expert SQL generator. Generate only clean and optimized SQL queries without any explanation\n
      If required take reference of previous Generated SQL QUery\n

        
        Return only the SQL query without any additional text or explanation.\n
        replace only the part of SQL query this is in between %%\n 
        for example %dummy text% \n
        for hq table primary key is id consider it as  string, instead of CAST(id AS VARCHAR) use only id
        do no change anything that is related to DATE_PART 

        Generate optimized SQL queries based on this schema:
        ${dbSchema}
        
        1. previous Generated SQL QUery
      .    ${lastSystemMessage?.content}`,
    };

    userMessages.unshift(systemMessages);

    setChatContext(userMessages);
  }, [chatHistory]);

  return chatContext;
};

export default useChatContext;
