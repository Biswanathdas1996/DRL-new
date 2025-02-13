import json
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sql.db import execute_sql_query
from gpt.analiticts import call_gpt
from helper.gpt import call_gpt_sql_data
from .static_questions import generate_static_sql


def similarity(a, b):
    try:
        vectorizer = TfidfVectorizer().fit_transform([a, b])
        vectors = vectorizer.toarray()
        return cosine_similarity(vectors)[0, 1]
    except Exception as e:
        print(f"Error calculating similarity: {e}")
        return 0


def call_gpt_to_refactor_query(query_text, query,  controlStatement="", chatContext={}):
    try:
        prompt = f"""Rewrite the below SQL Query as per\n {query}, {controlStatement}.\n
                
                    Refer SQL Query and generate a new SQL Query as per user prompt:\n
                    {query_text}\n
                    
                    """
        result_json = call_gpt_sql_data(prompt, chatContext)
        return result_json
    except Exception as e:
        print(f"Error calling GPT: {e}")
        return None


def pre_process_data(query, controlStatement="", chatContext={}):
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
        analytics = most_similar_query.get('analytics')
        print("query_id===============>", query_id) 

        final_query = query_text
        if(query_id == 12):
            sql_text = generate_static_sql(query + controlStatement)
            print("sql_text===============>", sql_text) 
            result1 = execute_sql_query(sql_text)
            print("result1===============>", result1)
            response = {
                "table1": result1,
                "questions": "",
                "analytics": ""
            } 
            return {"query": sql_text, "result": response,"summery":"", "type": "fixed"}
        else:
            if use == "Dynamic":
                try:
                    result_query = call_gpt_to_refactor_query(query_text, query, controlStatement, chatContext)
                except Exception as e:
                    print(f"Error calling GPT to refactor query: {e}")
                    return None
                if result_query is None:
                    return None
                final_query = result_query
                result = execute_sql_query(result_query)
            else:
                print("Static run===============>") 
                final_query = query_text
                result = execute_sql_query(query_text)
            response = {
                "text1": "As per your query the Distributor wise details are as below.",
                "table1": result,
                "text2": "If you would like additional followup information, please type in the chat box below",
                "questions": questions_texts,
                "analytics": analytics
            }
            # summery = call_gpt("You are a skilled data analyst.", f"""
            #                        Summarize the following user query and its context in 50 words or less:
            #                        - User Query: {query}
            #                        - Context: {str(result)}
                                
            #                        Highlight key insights and numbers. If financial data is present, convert it to words using INR (e.g., 120000 should be 1 Lakh 20 thousand).
            #             """, 1000)
            summery = ""
            return {"query": final_query, "result": response,"summery":summery, "type": "fixed"}

    except Exception as e:
        print(f"Error processing data: {e}")
        return None
