from helper.utils import get_config
from helper.gpt import call_gpt_sql_data
from sql.index import get_erd

# Function to generate SQL query using OpenAI
def generate_sql_query(user_question, controlStatement="", chatContext={}):
    try:
        prompt = f"""
        Translate the following natural language query to SQL query: {user_question} {controlStatement}.       
        """
        config = get_config()
        # sql_query_string = config.get('gpt').get('generate_sql_query')
        query = call_gpt_sql_data(prompt, chatContext)
        return query.replace('\n', ' ').replace('\t', ' ').replace('```sql', '').replace('```', '')
    except Exception as e:
        print(f"An error occurred while generating the SQL query: {e}")
        return None 

def nlq(user_question, controlStatement="", chatContext={}):
    try:
        query = generate_sql_query(user_question,  controlStatement, chatContext)
        print("Generated SQL Query:", query)
        return query
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None
