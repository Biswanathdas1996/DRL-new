import json
from difflib import SequenceMatcher
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sql.db import  execute_sql_query

from gpt.analiticts import  call_gpt

import numpy as np

def similarity(a, b):
            vectorizer = TfidfVectorizer().fit_transform([a, b])
            vectors = vectorizer.toarray()
            return cosine_similarity(vectors)[0, 1]

def call_gpt_to_refactor_query(query_text, query,working_table_description):
    prompt = f"""Rewrite the below SQL Query as per\n {query}.\n
                        Refer the Schema of the database and generate the SQL query.\n
                        Return only the SQL query without any additional text or explanation.\n
                        
                                
                        SQL Query:\n
                        {query_text}\n

                        Schema of the database:\n
                        {working_table_description}
                        """
    print("Calling GPT for DYnamic Query", prompt)
    result_json = call_gpt("you are a best SQL coder", prompt)
    return result_json
    # print("result_json============>",result_json)
            



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


        if(use == "Dynamic"):
            result_query = call_gpt_to_refactor_query(query_text, query, working_table_description)


            result = execute_sql_query(result_query)


            temp = {
                    "text1": "As per your query the Distributor wise details are as below.",
                    "table1": result,
                    "text2": "If you would like additional followup information, please type in the chat box below",
                    "questions": questions_texts
                }
            return {"query": query_text, "result": temp, "type": "fixed"}
            # return "ok"
        else:
            result = execute_sql_query(query_text)
            temp = {
                "text1": "As per your query the Distributor wise details are as below.",
                "table1": result,
                "text2": "If you would like additional followup information, please type in the chat box below",
                "questions": questions_texts
            }
            return ({
                "result": temp,
                "query": query_text,
                "type": "fixed"
            })
            

    except Exception as e:
        print(f"Error reading query storage: {e}")
        return None