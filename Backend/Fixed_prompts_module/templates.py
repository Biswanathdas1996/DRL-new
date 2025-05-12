
from sql.db import execute_sql_query

def get_templates(templates):
    
    results = []
    for template in templates:
        name = template.get("name")
        query = template.get("query")
        display = template.get("display")
        print("query=========>", query)
        data = execute_sql_query(query)
        results.append({"name": name, "query": query, "result": data, "display": display})
    print("query========ooooo=======>", results)
    return results


   
