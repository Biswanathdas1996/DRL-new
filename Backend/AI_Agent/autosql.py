import os
from langchain.chat_models import ChatOpenAI
from langchain.agents import create_sql_agent
from langchain_community.utilities import SQLDatabase
from secretes.secrets import OPENAI_API_KEY, DB_CONFIG

os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY

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

# Query Execution Function
def query_database(nlq: str):
    """Takes a natural language query (NLQ) and executes it using the SQL agent."""
    response = sql_agent.run(nlq)
    return response

# Example Usage
if __name__ == "__main__":
    nlq_query = """give total sales and target for hq Kolkata for November 2024 for hq id ["50058715", "50058741", "50173634", "50178275"]"""
    print(query_database(nlq_query))
