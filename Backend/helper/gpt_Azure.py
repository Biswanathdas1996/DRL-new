import os
import json
import openai  # You can still use the openai package with Azure endpoints
from secretes.secrets import AZURE_OPENAI_API_KEY, AZURE_ENDPOINT

# Set environment variables for Azure
os.environ["OPENAI_API_KEY"] = AZURE_OPENAI_API_KEY
os.environ["AZURE_ENDPOINT"] = AZURE_ENDPOINT

# Setting the OpenAI endpoint for Azure
openai.api_key = os.environ["OPENAI_API_KEY"]
openai.api_base = os.environ["AZURE_ENDPOINT"]

def save_erd_as_text_with_openAI(input_data):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # You can specify other models if needed
            messages=[
                {"role": "system", "content": "Convert the following JSON schema into a descriptive text format:"},
                {"role": "user", "content": input_data}
            ],
            max_tokens=1500
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"The error '{e}' occurred")

chat_history = []

def call_gpt(config, prompt, max_tokens=50):
    global chat_history
    try:
        # Ensure Azure API is set up correctly
        openai.api_key = os.environ["OPENAI_API_KEY"]
        openai.api_base = os.environ["AZURE_ENDPOINT"]
    except KeyError:
        return "API key or endpoint not found in environment variables."

    chat_history.append({"role": "user", "content": prompt})

    # Keep only the last 2 messages in chat_history
    if len(chat_history) > 2:
        chat_history = chat_history[-2:]

    # Calculate the total tokens in chat_history
    total_tokens = sum(len(message['content'].split()) for message in chat_history)

    # Define the maximum number of tokens allowed
    max_allowed_tokens = 2000

    # If total tokens exceed the maximum allowed, trim the chat_history
    while total_tokens > max_allowed_tokens and len(chat_history) > 1:
        chat_history.pop(0)
        total_tokens = sum(len(message['content'].split()) for message in chat_history)

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Use the appropriate model
            messages=[{"role": "system", "content": config}] + chat_history,
            temperature=0,
            max_tokens=max_tokens
        )
        result = response['choices'][0]['message']['content'].strip()
        chat_history.append({"role": "assistant", "content": result})
        return result
    except Exception as e:
        return f"An error occurred: {e}"

def call_gpt_sql_data(prompt, chatContext):
    try:
        openai.api_key = os.environ["OPENAI_API_KEY"]
        openai.api_base = os.environ["AZURE_ENDPOINT"]
    except KeyError:
        return "API key or endpoint not found in environment variables."
    
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

    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",  # Use the appropriate model
            messages=chatContext,
            temperature=0,
            stop=[";"]
        )
        result = response['choices'][0]['message']['content'].strip()
        return result
    except Exception as e:
        return f"An error occurred: {e}"
