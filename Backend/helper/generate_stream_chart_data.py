from google import genai
from google.genai import types
from PIL import Image
from io import BytesIO
import base64
from pydantic import BaseModel


GEMINI_API_KEY = "AIzaSyB6SXZ8k-Otk4NmfFvXK6lzqqRCScksku4"

data = [
    {
        "HQ Name": "Hooghly",
        "Month": "October  ",
        "Sales Achievement %": "122.07",
        "Total Sales": "771721.12",
        "Total Target": "632206.00"
    },
    {
        "HQ Name": "Kolkata",
        "Month": "October  ",
        "Sales Achievement %": "107.28",
        "Total Sales": "9864019.07",
        "Total Target": "9194820.99"
    },
    {
        "HQ Name": "Ranaghat",
        "Month": "October  ",
        "Sales Achievement %": "104.18",
        "Total Sales": "513079.62",
        "Total Target": "492516.00"
    },
    {
        "HQ Name": "Siliguri",
        "Month": "October  ",
        "Sales Achievement %": "97.78",
        "Total Sales": "1070940.20",
        "Total Target": "1095276.00"
    },
    {
        "HQ Name": "Hooghly",
        "Month": "November ",
        "Sales Achievement %": "101.13",
        "Total Sales": "686019.07",
        "Total Target": "678350.00"
    },
    {
        "HQ Name": "Kolkata",
        "Month": "November ",
        "Sales Achievement %": "98.89",
        "Total Sales": "9756410.81",
        "Total Target": "9865927.00"
    },
    {
        "HQ Name": "Ranaghat",
        "Month": "November ",
        "Sales Achievement %": "98.13",
        "Total Sales": "518561.78",
        "Total Target": "528462.00"
    },
    {
        "HQ Name": "Siliguri",
        "Month": "November ",
        "Sales Achievement %": "108.00",
        "Total Sales": "1269234.35",
        "Total Target": "1175215.00"
    },
    {
        "HQ Name": "Hooghly",
        "Month": "December ",
        "Sales Achievement %": "109.53",
        "Total Sales": "743021.11",
        "Total Target": "678350.00"
    },
    {
        "HQ Name": "Kolkata",
        "Month": "December ",
        "Sales Achievement %": "102.43",
        "Total Sales": "10106047.64",
        "Total Target": "9865927.00"
    },
    {
        "HQ Name": "Ranaghat",
        "Month": "December ",
        "Sales Achievement %": "100.09",
        "Total Sales": "528922.20",
        "Total Target": "528462.00"
    },
    {
        "HQ Name": "Siliguri",
        "Month": "December ",
        "Sales Achievement %": "103.87",
        "Total Sales": "1220684.83",
        "Total Target": "1175215.00"
    }
]







from pydantic import RootModel

class DataPoint(BaseModel):
    x: str
    y: int

class ChartData(BaseModel):
    id: str
    data: list[DataPoint]


client = genai.Client(api_key=GEMINI_API_KEY)
response = client.models.generate_content(
    model='gemini-2.0-flash',
    contents=f"""
        analyse {data}, find proper combination to generate @nivo/stream line chart 
""",
    config={
        'response_mime_type': 'application/json',
        'response_schema': list[ChartData],
    },
)
# Use the response as a JSON string.
print(response.text)

# Use instantiated objects.
my_recipes: list[ChartData] = response.parsed