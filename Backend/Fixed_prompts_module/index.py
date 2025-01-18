import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sql.db import execute_sql_query
from gpt.analiticts import call_gpt


def similarity(a, b):
    try:
        vectorizer = TfidfVectorizer().fit_transform([a, b])
        vectors = vectorizer.toarray()
        return cosine_similarity(vectors)[0, 1]
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0


def call_gpt_to_refactor_query(query_text, query, working_table_description):
    try:
        prompt = f"""Rewrite the below SQL Query as per\n {query}.\n
                Return only the SQL query without any additional text or explanation.\n
                Do not use "=" operator; instead, use LIKE operator in name \n
                Use only "=" operator for DATE_PART \n
                for INNER JOIN use only "=" operator\n

                    SQL Query:\n
                    {query_text}\n
                    Schema of the database:\n
                    {working_table_description}`
                    """
        result_json = call_gpt("you are a best SQL coder", prompt)
        return result_json
    except Exception as e:
        print(f"Error calling GPT: {e}")
        return None


def pre_process_data(query, working_table_description):
    try:
        with open('query_storage/query.json', 'r') as file:
            queries = json.load(file)
        
        most_similar_query = max(queries, key=lambda q: similarity(q['name'], query))
        if similarity(most_similar_query['name'], query) < 0.5:
            return None

        query_id = most_similar_query.get('id')
        query_text = most_similar_query.get('query')
        questions_texts = most_similar_query.get('questions')
        use = most_similar_query.get('use')
        print("query_id===============>", query_id) 


        if(query_id == 3.1):
            result1 = execute_sql_query(most_similar_query.get('query'))
            result2 = execute_sql_query(most_similar_query.get('query2'))
            response = {
                "text1": "As per your query the Distributor wise details are as below.",
                "table1": result1,
                "table2": result2,
                "text2": "If you would like additional followup information, please type in the chat box below",
                "questions": questions_texts
            }
        else:
            if use == "Dynamic":
                try:
                    result_query = call_gpt_to_refactor_query(query_text, query, working_table_description)
                except Exception as e:
                    print(f"Error calling GPT to refactor query: {e}")
                    return None
                if result_query is None:
                    return None
                result = execute_sql_query(result_query)
            else:
                result = execute_sql_query(query_text)

            response = {
                "text1": "As per your query the Distributor wise details are as below.",
                "table1": result,
                "text2": "If you would like additional followup information, please type in the chat box below",
                "questions": questions_texts
            }
        
        return {"query": query_text, "result": response, "type": "fixed"}

    except Exception as e:
        print(f"Error processing data: {e}")
        return None
