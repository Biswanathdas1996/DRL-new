from flask import request, jsonify
from autogen import AssistantAgent, config_list_from_json
import os
import json



config_path = os.path.join(os.getcwd(), "OAI_CONFIG_LIST.json")
if not os.path.exists(config_path):
    raise FileNotFoundError(f"Required config file not found: {config_path}")
config_list = config_list_from_json(
    config_path,
    filter_dict={"model": ["gpt-4"]},
)

code_executor = AssistantAgent(
    name="CodeExecutorAgent",
    llm_config={
        "config_list": config_list,
        "temperature": 0,
    },
    system_message="You are a Python expert. Execute code and return the result.",
    code_execution_config={
        "use_docker": False
    }
)



def convert_data():
    req_data = request.get_json()
    data = req_data.get("data")
    sample_output_template = req_data.get("sample_output_template")
    if not data:
        return jsonify({"error": "Missing 'data' in request"}), 400

    prompt = f"""

        Data: {data} \n

        First, analyze the data and understand its structure.
        Identify a proper combinations and relationships between the data points.

        Then convert the data into a format suitable chart.
        The chart should have the following properties:
        {sample_output_template}.
        
        Note: return only 5 data points in the output mixup with highest and lowest in values.
        Labels should be in short form.
        Reply with the output as JSON only.
    """
    result = code_executor.generate_reply(messages=[{"content": prompt, "role": "user"}])
    # result is a string containing the output
    content = result
    # Remove code block markers if present
    if content.startswith("```json"):
        content = content[7:]
    if content.startswith("```"):
        content = content[3:]
    if content.endswith("```"):
        content = content[:-3]
    content = content.strip()
    try:
        json_data = json.loads(content)
    except Exception:
        return jsonify({"error": "Failed to parse JSON", "raw": content}), 500
    return jsonify(json_data)



    # print("Result:", result)
    # # result is a string containing the output
    # content = result.get("content", "")
    # # Remove code block markers if present
    # content = content.strip()
    # if content.startswith("```json"):
    #     content = content[7:]
    # if content.startswith("```"):
    #     content = content[3:]
    # if content.endswith("```"):
    #     content = content[:-3]
    # content = content.strip()
    # # Remove any leading/trailing triple backticks and whitespace
    # content = content.strip('` \n')
    # try:
    #     json_data = json.loads(content)
    # except Exception:
    #     return jsonify({"error": "Failed to parse JSON", "raw": content}), 500
    # return jsonify(json_data)




def render_data_analytics(app):
    app.add_url_rule('/data-processing', 'convert_data_api', convert_data, methods=['POST'])
    return app 
