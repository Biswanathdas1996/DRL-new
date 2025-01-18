import os
from secretes.secrets import OPENAI_API_KEY
from langchain.agents import initialize_agent, Tool, AgentType
from langchain_community.chat_models import ChatOpenAI

def set_environment_variable():
    try:
        os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
    except Exception as e:
        print(f"Error setting environment variable: {e}")

set_environment_variable()



def create_prompt(query, query_text, working_table_description):
    return f"""Rewrite the below SQL Query as per\n {query}.\n
               Return only the SQL query without any additional text or explanation.\n
               Do not use "=" operator; instead, use LIKE operator in name \n
               Use only "=" operator for DATE_PART \n
               for INNER JOIN use only "=" operator\n
               SQL Query:\n
               {query_text}\n
               Schema of the database:\n
               {working_table_description}
            """

def validate_input_code(query, query_text, working_table_description):
    prompt = create_prompt(query, query_text, working_table_description)
    llm = ChatOpenAI(model="gpt-4", temperature=0)

    # Define a simple tool to return the response
    def validate_code_tool(input_text):
        return llm.predict(input_text)

    tools = [
        Tool(
            name="code_validator_tool",
            func=validate_code_tool,
            description="Validates and provides recommendations for input code.",
        )
    ]

    agent = initialize_agent(
        tools=tools,
        llm=llm,
        agent=AgentType.OPENAI_FUNCTIONS,
        verbose=True,
    )

    try:
        response = agent.run(prompt)
        if isinstance(response, str):
            return response.strip()
        return ""
    except Exception as e:
        print(f"Error during agent execution: {e}")
        return None

def call_gpt_to_refactor_query(query, query_text, working_table_description):
    try:
        response = validate_input_code(query, query_text, working_table_description)
        if not response:
            return None
        return response
    except Exception as e:
        print(f"Error during agent run: {e}")
        return "An error occurred while processing the query"


def refactor_query(query, query_text, working_table_description):
   

    if not all([query, query_text, working_table_description]):
        return "Missing required fields"

    return call_gpt_to_refactor_query(query, query_text, working_table_description)


