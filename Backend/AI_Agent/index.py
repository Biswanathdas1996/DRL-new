import os
from langchain.chat_models import ChatOpenAI
from langchain.agents import create_sql_agent
from langchain_community.utilities import SQLDatabase
from secretes.secrets import OPENAI_API_KEY, DB_CONFIG
from flask import Flask, request, jsonify

os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

# Query Execution Function
def query_database(nlq: str):
    """Takes a natural language query (NLQ) and executes it using the SQL agent."""
    # Create a connection string
    db_uri = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}"
    db = SQLDatabase.from_uri(db_uri)

    # Initialize the LLM model
    llm = ChatOpenAI(model="gpt-4", temperature=0)  # Use "gpt-3.5-turbo" for cost efficiency

    # Create SQL Agent
    sql_agent = create_sql_agent(
        llm=llm,
        db=db,
        verbose=True
    )
    
    response = sql_agent.run(nlq)
    return response

def query():
    data = request.json
    nlq = data.get('nlq')
    if not nlq:
        return jsonify({"error": "No NLQ provided"}), 400
    try:
        response = query_database(nlq)
        return jsonify({"response": response})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def render_agents(app):
    app.add_url_rule('/get-agent-response', 'query_agent_api', query, methods=['POST'])
    return app
