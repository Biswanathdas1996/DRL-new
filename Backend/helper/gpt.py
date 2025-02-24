
from secretes.secrets import LLM_TYPE

if LLM_TYPE == "OpenAI":
    from helper.gpt_OpenAI import *
elif LLM_TYPE == "Azure":
    from helper.gpt_Azure import *
elif LLM_TYPE == "Gemini":
    from helper.gemini import *
