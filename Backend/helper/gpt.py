import openai  # type: ignore
import os
from secretes.secrets import OPENAI_API_KEY
from PIL import Image  # type: ignore
import base64
from io import BytesIO

try:
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
except Exception as e:
    print(f"Error setting environment variable: {e}")

def call_gpt(config, prompt, max_tokens=50):
    try:
        openai.api_key = os.environ["OPENAI_API_KEY"]
    except KeyError:
        return "API key not found in environment variables."

    try:
        response = openai.ChatCompletion.create(
            model=os.environ.get("X-Ai-Model", "gpt-4"),
            messages=[
                {"role": "system", "content": config},
                {"role": "user", "content": prompt}
            ],
            temperature=0,
            n=1,
            stop=None
        )
        result = response.choices[0].message['content'].strip()
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
