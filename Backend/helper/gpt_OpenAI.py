import openai  # type: ignore
import os
from secretes.secrets import OPENAI_API_KEY
import json

try:
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
except Exception as e:
    print(f"Error setting environment variable: {e}")


def save_erd_as_text_with_openAI(input_data):
    try:
        openai.api_key = OPENAI_API_KEY
        
        response = openai.ChatCompletion.create(
            model="gpt-4o",
            messages=[
               {"role": "system", "content": "Convert the following JSON schema into a descriptive text format:"},
                {"role": "user", "content": input_data}
            ],
            max_tokens=1500
        )
        return response.choices[0].message['content'].strip()
    except Exception as e:
        print(f"The error '{e}' occurred")
     
chat_history = []

def call_gpt(config, prompt, max_tokens=50):
    global chat_history
    try:
        openai.api_key = os.environ["OPENAI_API_KEY"]
    except KeyError:
        return "API key not found in environment variables."

    global chat_history
    chat_history.append({"role": "user", "content": prompt})

    # Keep only the last 2 messages in chat_history
    if len(chat_history) > 2:
        chat_history = chat_history[-2:]
    print("Chat History:", chat_history)  

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
            model=os.environ.get("X-Ai-Model", "gpt-4"),
            messages=[{"role": "system", "content": config}] + chat_history,
            temperature=0,
            stop=None
        )
        result = response.choices[0].message['content'].strip()
        chat_history.append({"role": "assistant", "content": result})
        print("GPT Response:", response)
        return result
    except Exception as e:
        return f"An error occurred: {e}"
    

def call_gpt_sql_data(prompt, chatContext):
    try:
        openai.api_key = os.environ["OPENAI_API_KEY"]
    except KeyError:
        return "API key not found in environment variables."
    
    # Ensure chatContext is a list
    if isinstance(chatContext, str):
        try:
            chatContext = json.loads(chatContext)  # Convert string to list
        except json.JSONDecodeError:
            return "Invalid chatContext format. Expected JSON string representing a list."
    
    if not isinstance(chatContext, list):
        chatContext = []  # Ensure it's a list if something went wrong
    
    # **Fix invalid role names** - Mapping incorrect roles to valid ones
    role_mapping = {
        "User Question": "user",
        "LLM Response": "assistant"
    }
    
    for message in chatContext:
        if "role" in message and message["role"] in role_mapping:
            message["role"] = role_mapping[message["role"]]
    
    # Append the new user prompt
    chatContext.append({"role": "user", "content": prompt})

    print("Chat Context:==============>", chatContext)
    print("Chat Context end:==============>")

    try:
        response = openai.ChatCompletion.create(
            model=os.environ.get("X-Ai-Model", "gpt-4"),
            messages=chatContext,
            temperature=0,
            stop=[";"]
        )
        result = response.choices[0].message['content'].strip()
        
        # Print the response for debugging
        print("GPT Response:", response)
        
        return result
    except Exception as e:
        return f"An error occurred: {e}"

    """Call the GPT model with the given configuration and prompt."""
    try:
        openai.api_key = os.environ["OPENAI_API_KEY"]
    except KeyError:
        return "API key not found in environment variables."

    try:
        response = openai.ChatCompletion.create(
            model=os.environ.get("X-Ai-Model", "gpt-4"),
            messages=[
                {"role": "system", "content": config},
                {"role": "user", "content": f"""
                    {prompt}\n

                    Where the previous chat history was:\n
                    {chatContext}
                    """}
            ],
            temperature=0,
            stop=[";"]
        )
        result = response.choices[0].message['content'].strip()
        print("GPT Response:", response)
        return result
    except Exception as e:
        return f"An error occurred: {e}"
