import openai  # type: ignore
import os
from secretes.secrets import OPENAI_API_KEY
from PIL import Image  # type: ignore
import base64
from io import BytesIO
import json

try:
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
except Exception as e:
    print(f"Error setting environment variable: {e}")

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
    

def call_gpt_sql_data(config, prompt, chatContext):
    try:
        openai.api_key = os.environ["OPENAI_API_KEY"]
    except KeyError:
        return "API key not found in environment variables."
    
    print("========== Original chatContext:", chatContext)

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

    print("==========================> Updated chatContext:", chatContext)
    
    try:
        response = openai.ChatCompletion.create(
            model=os.environ.get("X-Ai-Model", "gpt-4"),
            messages=[{"role": "system", "content": config}] + chatContext,
            temperature=0,
            stop=None
        )
        result = response.choices[0].message['content'].strip()
        
        # Print the response for debugging
        print("GPT Response:", response)
        
        return result
    except Exception as e:
        return f"An error occurred: {e}"
    
def extract_image(file_path):
    try:
        # Open the image file
        img = Image.open(file_path)
    except Exception as e:
        return f"Error opening image file: {e}"

    try:
        # Convert the image to base64
        buffered = BytesIO()
        img.save(buffered, format="PNG")
        img_base64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    except Exception as e:
        return f"Error processing image file: {e}"

    # Create the request payload
    content = [
        {
            "type": "image_url",
            "image_url": {
                "url": f"data:image/png;base64,{img_base64}"
            }
        }
    ]

    return call_gpt("You are good image reader", content, max_tokens=2048)
