import os
from langchain.chat_models import ChatOpenAI
from langchain.agents import create_sql_agent
from langchain_community.utilities import SQLDatabase
from secretes.secrets import OPENAI_API_KEY, DB_CONFIG
from flask import Flask, request, jsonify, Response, stream_with_context

os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY



# Query Execution Function
def query_database(nlq: str):
    """Takes a natural language query (NLQ) and executes it using the SQL agent."""
    # Create a connection string
    db_uri = f"postgresql://{DB_CONFIG['user']}:{DB_CONFIG['password']}@{DB_CONFIG['host']}:{DB_CONFIG['port']}/{DB_CONFIG['dbname']}"
    yield f"data: Connecting to database at {db_uri}\n\n"

    db = SQLDatabase.from_uri(db_uri)
    yield "data: Database connection established\n\n"

    # Initialize the LLM model
    llm = ChatOpenAI(model="gpt-4", temperature=0)  # Use "gpt-3.5-turbo" for cost efficiency
    yield "data: LLM model initialized\n\n"

    # Create SQL Agent
    sql_agent = create_sql_agent(
        llm=llm,
        db=db,
        verbose=True
    )
    yield "data: SQL Agent created\n\n"
    
    response = sql_agent.run(nlq)
    
    yield f"data: Query executed, response: {response}\n\n"
    return response

def stream_query(nlq):
    try:
        for step in query_database(nlq):
            yield step
    except Exception as e:
        yield f"data: {str(e)}\n\n"

def query():
    data = request.json
    nlq = data.get('nlq')
    if not nlq:
        return jsonify({"error": "No NLQ provided"}), 400
    return Response(stream_with_context(stream_query(nlq)), content_type='text/event-stream')

def render_agents(app):
    app.add_url_rule('/get-agent-response', 'query_agent_api', query, methods=['POST'])
    return app

