from helper.utils import get_config
from helper.gpt import call_gpt_sql_data
from sql.index import get_erd

# Function to generate SQL query using OpenAI
def generate_sql_query(user_question, working_table_description, controlStatement="", chatContext={}):
    try:
        prompt = f"""
        Translate the following natural language query to SQL query: {user_question} {controlStatement}.
        Return only the SQL query without any additional text or explanation.
        
        Here is the schema of the database:
            {working_table_description}
        """
        config = get_config()
        sql_query_string = config.get('gpt').get('generate_sql_query')
        query = call_gpt_sql_data(sql_query_string, prompt, chatContext)
        return query.replace('\n', ' ').replace('\t', ' ').replace('```sql', '').replace('```', '')
    except Exception as e:
        print(f"An error occurred while generating the SQL query: {e}")
        return None 

def nlq(user_question, working_table_description, controlStatement="", chatContext={}):
    try:
        query = generate_sql_query(user_question, working_table_description, controlStatement, chatContext)
        print("Generated SQL Query:", query)
        return query
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None
