from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from flask_compress import Compress
import os
from main.nlq import nlq
from helper.utils import add_query_to_json
from gpt.analiticts import getAnalytics, call_gpt
from helper.gpt import extract_image
from sql.db import generate_erd_from, execute_sql_query
from mongodb.rag import render_mongo_pack
from Fixed_prompts_module.index import pre_process_data
from Log.index import log, render_logs_pack

app = Flask(__name__)
Compress(app)
CORS(app)
app = render_mongo_pack(app)
app = render_logs_pack(app)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16 MB limit

@app.before_request
def before_request():
    custom_header = request.headers.get('X-Ai-Model')
    custom_user = request.headers.get('X-DRL-USER')
    if custom_header:
        os.environ["X-Ai-Model"] = custom_header
        print(f"X-Ai-Model: {custom_header}")
    if custom_user:
        os.environ["X-DRL-USER"] = custom_user
        print(f"X-DRL-USER: {custom_user}")

@app.route('/save-query', methods=['POST'])
def save_query():
    data = request.json
    q_data = data.get('data')
    if not q_data:
        return jsonify({"error": "No question provided"}), 400
    try:
        add_query_to_json(q_data)
        return jsonify({"status": "success"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/query-list', methods=['GET'])
def get_all_query():
    try:
        with open('query_storage/query.json', 'r') as file:
            result_json = file.read()
            print("Mock Result:", result_json)
            return result_json
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/query', methods=['POST'])
def query():
    data = request.json
    user_question = data.get('question')
    controlStatement = data.get('controlStatement')
    working_table_description = data.get('working_table_description')
    if not user_question:
        return jsonify({"error": "No question provided"}), 400

    # try:
    #     query = nlq(user_question, working_table_description)
    #     result = execute_sql_query(query)
    #     return jsonify({"result": result, "query": query, "type": "dynamic"})
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500
    try:
        pre_data = pre_process_data(user_question, working_table_description, controlStatement)
        if pre_data:
            return jsonify(pre_data)
        else:
            query = nlq(user_question, working_table_description, controlStatement)
            result = execute_sql_query(query)

            summery = call_gpt("You are a good data scientist", f"""
                               Reply to the user query: {user_question} by summarizing the below Context in 50 words/n
                               if any financial data is present in the context, please use INR and make it in words Like: if  120000 the use 1 Lakh 20 thousand /n
                               Context /n{str(result)}

                    """, 1000)
            
            try:
                log(os.environ["X-DRL-USER"], user_question, query)
            except Exception as log_error:
                print(f"Logging error: {log_error}")

            return jsonify({"result": result, "query": query,"summery":summery, "type": "dynamic"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/analytics', methods=['POST'])
def analytics_data():
    data = request.json
    result_json = data.get('result_json')
    if not result_json:
        return jsonify({"error": "No data provided"}), 400
    try:
        analytics = getAnalytics(result_json)
        return jsonify({"analytics": analytics})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/execute-raw-query', methods=['POST'])
def execute_query():
    data = request.json
    user_sql_query = data.get('sql_query')
    if not user_sql_query:
        return jsonify({"error": "No question provided"}), 400
    try:
        result = execute_sql_query(user_sql_query)
        if 'error' in result:
            return jsonify({"error": str(result['error'])}), 500
        response = jsonify({"result": result, "query": user_sql_query})
        response.headers['Content-Type'] = 'application/json'
        response.headers['Content-Disposition'] = 'attachment; filename=result.json'
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/call-gpt', methods=['POST'])
def direct_gpt_call():
    data = request.json
    user_question = data.get('question')
    token_limit = data.get('token_limit', 1000)
    if not user_question:
        return jsonify({"error": "No question provided"}), 400
    try:
        result_json = call_gpt("You are a polite, helping intelligent agent", user_question, token_limit)
        return result_json
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route('/generate-erd-from-db', methods=['POST'])
def generate_erd_from_db():
    dbname = request.form.get('dbname')
    user = request.form.get('user')
    password = request.form.get('password')
    host = request.form.get('host')
    port = request.form.get('port')

    if not all([dbname, user, password, host, port]):
        return jsonify({"error": "Missing database configuration parameters"}), 400

    DB_CONFIG = {
        'dbname': dbname,
        'user': user,
        'password': password,
        'host': host,
        'port': port
    }
    
    try:
        json_result = generate_erd_from(DB_CONFIG)
        return json_result, 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/get-erd-image', methods=['GET'])
def get_erd_img():
    try:
        erd_image_path = 'sql/erd.png'
        return send_file(erd_image_path, mimetype='image/png')
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    employeecode = data.get('employeecode')
    password = data.get('password')
    
    print(f"Employee Code: {employeecode}, Password: {password}")
    
    if not employeecode or not password:
        return jsonify({"error": "Employee code and password are required"}), 400
    
    try:
        # Fetch user details including hq_ids
        query = f"SELECT distinct emp_code, hq_id, name FROM userdetails WHERE emp_code = '{employeecode}' AND password = '{password}' AND loginenabled = true"
        user_result = execute_sql_query(query)
        
        if not user_result:
            return jsonify({"message": "Unauthenticated"}), 401
        # Extract hq_ids from the result
        hq_ids = [row['hq_id'] for row in user_result]
        if not hq_ids:
            return jsonify({
                "message": "Authentication Successful",
                "hq_ids": [],
                "hq_names": []
            }), 200

        # Fetch hq_names corresponding to hq_ids
        hq_query = f"SELECT id, name FROM hq WHERE id IN ({','.join(f"'{hq_id}'" for hq_id in hq_ids)})"
        hq_result = execute_sql_query(hq_query)
        # Extract hq_names
        hq_names = [row['name'] for row in hq_result]

        return jsonify({
            "message": "Authentication Successful",
            "hq_ids": hq_ids,
            "hq_names": hq_names,
            "result": user_result
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



if __name__ == '__main__':
    app.run(debug=True)
