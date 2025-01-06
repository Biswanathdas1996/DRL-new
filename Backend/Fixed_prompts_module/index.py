import json
from difflib import SequenceMatcher
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sql.db import  execute_sql_query

import numpy as np

def similarity(a, b):
            vectorizer = TfidfVectorizer().fit_transform([a, b])
            vectors = vectorizer.toarray()
            return cosine_similarity(vectors)[0, 1]

def pre_process_data(query):
    try:
        with open('query_storage/query.json', 'r') as file:
            queries = json.load(file)
            
        most_similar_query = max(queries, key=lambda q: similarity(q['name'], query))
        if similarity(most_similar_query['name'], query) < 0.6:
            return None


        query_id = most_similar_query.get('id')
        query_text = most_similar_query.get('query')
        questions_texts = most_similar_query.get('questions')

        if(query_id == int('1733987824')):
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