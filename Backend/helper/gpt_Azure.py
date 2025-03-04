import os
import base64
import openai
import json
from secretes.secrets import AZURE_OPENAI_API_KEY, AZURE_ENDPOINT

from langchain.chat_models import AzureChatOpenAI
from langchain.schema import HumanMessage, SystemMessage

# Initialize the Azure OpenAI Service client
endpoint = AZURE_ENDPOINT
deployment = "sales-ai-gpt4"  # Ensure this deployment name corresponds to your setup

# Key-based authentication
openai.api_key = AZURE_OPENAI_API_KEY
openai.api_base = endpoint

# Initialize AzureChatOpenAI client
llm = AzureChatOpenAI(
    openai_api_version="2024-05-01-preview",
    openai_api_key=AZURE_OPENAI_API_KEY,
    openai_api_base=endpoint,
    openai_api_type="azure",
    deployment_name=deployment   
)

def save_erd_as_text_with_openAI(input_data):
    try:
        # Prepare the messages for the chat-based model
        messages = [
            SystemMessage(content="Convert the following JSON schema into a descriptive text format:"),
            HumanMessage(content=input_data)
        ]
        
        # Invoke the model
        response = llm.invoke(messages)
        
        # Access the 'content' directly from the AIMessage object
        if hasattr(response, 'content'):
            content = response.content
        else:
            content = ''
        
        # Return the cleaned content (strip leading/trailing whitespace)
        return content.strip()
    except Exception as e:
        print(f"The error '{e}' occurred")

chat_history = []

def call_gpt(config, prompt, max_tokens=50):
    global chat_history
    try:
        chat_history.append(HumanMessage(content=prompt))

        # Keep only the last 2 messages in chat_history
        if len(chat_history) > 2:
            chat_history = chat_history[-2:]

        # Calculate the total tokens in chat_history
        total_tokens = sum(len(message.content.split()) for message in chat_history)

        # Define the maximum number of tokens allowed
        max_allowed_tokens = 2000

        # If total tokens exceed the maximum allowed, trim the chat_history
        while total_tokens > max_allowed_tokens and len(chat_history) > 1:
            chat_history.pop(0)
            total_tokens = sum(len(message.content.split()) for message in chat_history)

        # Prepare the messages with system config
        messages = [
            SystemMessage(content=config)
        ] + chat_history

        # Invoke the model
        response = llm.invoke(messages, temperature=0, max_tokens=max_tokens)
        
        # Access the 'content' directly from the AIMessage object
        if hasattr(response, 'content'):
            content = response.content
        else:
            content = ''
        
        # Return the cleaned content (strip leading/trailing whitespace)
        return content.strip()
    except Exception as e:
        return f"An error occurred: {e}"

def call_gpt_sql_data(prompt, chatContext):
    try:
        # Ensure chatContext is a list
        if isinstance(chatContext, str):
            try:
                chatContext = json.loads(chatContext)  # Convert string to list
            except json.JSONDecodeError:
                return "Invalid chatContext format. Expected JSON string representing a list."

        if not isinstance(chatContext, list):
            chatContext = []  # Ensure it's a list if something went wrong

        # Fix invalid role names - Mapping incorrect roles to valid ones
        role_mapping = {
            "User Question": "user",
            "LLM Response": "assistant"
        }

        for message in chatContext:
            if "role" in message and message["role"] in role_mapping:
                message["role"] = role_mapping[message["role"]]

        # Append the new user prompt
        chatContext.append({"role": "user", "content": prompt})

        # Prepare messages with roles
        messages = [
            HumanMessage(content=message["content"]) if message["role"] == "user" else SystemMessage(content=message["content"])
            for message in chatContext
        ]

        # Invoke the model
        response = llm.invoke(messages, temperature=0, top_p=0.95, frequency_penalty=0, presence_penalty=0, stop=[";"], stream=False)
        
        # Access the 'content' directly from the AIMessage object
        if hasattr(response, 'content'):
            content = response.content
        else:
            content = ''
        
        # Return the cleaned content (strip leading/trailing whitespace)
        return content.strip()
    except Exception as e:
        return f"An error occurred: {e}"