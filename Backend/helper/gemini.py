import os
import google.generativeai as genai
from secretes.secrets import GEMINI_API_KEY, GOOGLE_MODEL_NAME
import json
import re

def extract_sql_code(text):
    """Extracts pure SQL code from a text, removing comments and explanations."""
    # Regular expression to find SQL code blocks (improved)
    sql_match = re.search(r"```sql\n(.*?)\n```", text, re.DOTALL | re.IGNORECASE)  # Look for ```sql blocks
    if sql_match:
      sql_code = sql_match.group(1).strip()
    else:
      sql_match = re.search(r"(.*?)(?=(?:;|$))", text, re.DOTALL | re.IGNORECASE) #Look for SQL code even without ```sql
      if sql_match:
        sql_code = sql_match.group(1).strip()
      else:
        return None  # Or handle the case where no SQL is found

    # Remove single-line comments
    sql_code = re.sub(r"--.*$", "", sql_code, flags=re.MULTILINE)
    # Remove multi-line comments
    sql_code = re.sub(r"/\*.*?\*/", "", sql_code, re.DOTALL)
    # Remove leading/trailing whitespace and newlines
    sql_code = sql_code.strip()

    return sql_code


try:
    os.environ["OPENAI_API_KEY"] = GEMINI_API_KEY
except Exception as e:
    print(f"Error setting environment variable: {e}")

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel(GOOGLE_MODEL_NAME)



def save_erd_as_text_with_openAI(input_data):
    try:
        os.environ["OPENAI_API_KEY"] = GEMINI_API_KEY
        
        response = model.generate_content(
            f"Convert the following JSON schema into a descriptive text format:\n{input_data}"
        )
        return response.text.strip()
    except Exception as e:
        print(f"The error '{e}' occurred")

chat_history = []

def call_gpt(prompt, token=None):
    global chat_history
    try:
        os.environ["OPENAI_API_KEY"] = GEMINI_API_KEY
    except KeyError:
        return "API key not found in environment variables."

    chat_history.append({"role": "user", "content": prompt})

    if len(chat_history) > 2:
        chat_history = chat_history[-2:]

    total_tokens = sum(len(message['content'].split()) for message in chat_history)
    max_allowed_tokens = 2000

    while total_tokens > max_allowed_tokens and len(chat_history) > 1:
        chat_history.pop(0)
        total_tokens = sum(len(message['content'].split()) for message in chat_history)

    try:
        response = model.generate_content(prompt)
        result = response.text.replace('```', '').replace('gherkin', '')
        chat_history.append({"role": "assistant", "content": result})
        return result
    except Exception as e:
        return f"An error occurred: {e}"

def call_gpt_sql_data(prompt, chatContext):
    try:
        os.environ["OPENAI_API_KEY"] = GEMINI_API_KEY
    except KeyError:
        return "API key not found in environment variables."

    if isinstance(chatContext, str):
        try:
            chatContext = json.loads(chatContext)
        except json.JSONDecodeError:
            return "Invalid chatContext format. Expected JSON string representing a list."

    if not isinstance(chatContext, list):
        chatContext = []

    role_mapping = {
        "User Question": "user",
        "LLM Response": "assistant"
    }

    for message in chatContext:
        if "role" in message and message["role"] in role_mapping:
            message["role"] = role_mapping[message["role"]]

    chatContext.append({"role": "user", "content": f"""{prompt}
                        Instructions: 
                        - Create a postgress SQL QUERY in one line 
                        - Provide only the pure SQL query.
                        - Do not include any additional text.
                        - Do not add any comments or explanations.
                        """})

    try:
        response = model.generate_content(prompt)
        result = response.text

        print("=============GEMINI RESPONSE====================", extract_sql_code(result))

        return extract_sql_code(result)
    except Exception as e:
        return f"An error occurred: {e}"