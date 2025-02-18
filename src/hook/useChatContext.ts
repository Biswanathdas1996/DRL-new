import { useState, useEffect } from "react";

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

        1. **sales** (id, transaction_date, primary_sales, primary_units, sku_code, division_code, stockist_id, hq_id)
            - 🔗 sku_code → sku.code
            - 🔗 division_code → division.code
            - 🔗 stockist_id → stockist.id
            - 🔗 hq_id → hq.id

            2. **target** (id, target_date, target_units, target_value, sku_code, division_code, hq_id)
            - 🔗 sku_code → sku.code
            - 🔗 division_code → division.code
            - 🔗 hq_id → hq.id

            3. **sku** (code, name)

            4. **brand** (id, name, category)
            - 🔗 brandskumap.brand_id → brand.id
            - 🔗 brandskumap.sku_code → sku.code

            5. **brandskumap** (brand_id, sku_code)
            - Links brands to SKUs.

            6. **hq** (id, name)  
            - Headquarters of operations.

            7. **stockist** (id, name)  
            - Distributors linked to sales.

            8. **division** (code, name)  

            9. **usermanagermap** (id, userid, managerid)
            - 🔗 userid → userdetails.id
            - 🔗 managerid → userdetails.id

            10. **userdetails** (id, name, roleid, hq_id, loginenabled, emp_code)
                - 🔗 roleid → role.id
                - 🔗 hq_id → hq.id

            11. **role** (id, name)  
                - Defines user roles.

            12. **conversation_log** (id, timestamp, user_id, userquery, sqlquery)  
                - Stores AI-generated queries.
                    \n
        1. previous Generated SQL QUery
      .    ${lastSystemMessage?.content}`,
    };

    userMessages.unshift(systemMessages);

    console.log("=======userMessages========>", userMessages);
    setChatContext(userMessages);
  }, [chatHistory]);

  return chatContext;
};

export default useChatContext;
