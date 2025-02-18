from secretes.secrets import DB_CONFIG
import psycopg2
from psycopg2 import sql, OperationalError
import json
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import networkx as nx
from flask import request, jsonify
from psycopg2.extras import RealDictCursor



def create_connection(DB_CONFIG):
    try:
        connection = psycopg2.connect(**DB_CONFIG)
        return connection
    except OperationalError as e:
        print(f"The error '{e}' occurred")
        return None

def log(user_id, userquery, sqlquery):
    connection = create_connection(DB_CONFIG)
    cursor = connection.cursor()
   
    try:
        cursor.execute("""
            INSERT INTO conversation_log (user_id, userquery, sqlquery, timestamp)
            VALUES (%s, %s, %s, timezone('Asia/Kolkata', now()))
            RETURNING id, timestamp;
        """, (user_id, userquery, sqlquery))
        connection.commit()
        result = cursor.fetchone()
        print("==========================================>>>>>>>",result)
        return result[0]
       
    except Exception as e:
        connection.rollback()
        print(e)
        return None
   
    finally:
        cursor.close()
        connection.close()
 

def get_logs():
    user_id = request.args.get('user_id')
    limit = request.args.get('limit', 100, type=int)  # Default limit to 10
   
    conn =  create_connection(DB_CONFIG)
    cursor = conn.cursor(cursor_factory=RealDictCursor)
   
    try:
        if user_id:
            cursor.execute("""
                SELECT id, user_id, userquery, sqlquery, timestamp
                FROM conversation_log
                WHERE user_id = %s
                ORDER BY timestamp DESC
                LIMIT %s;
            """, (user_id, limit))
        else:
            cursor.execute("""
                SELECT id, user_id, userquery, sqlquery, timestamp
                FROM conversation_log
                ORDER BY timestamp DESC
                LIMIT %s;
            """, (limit,))
       
        logs = cursor.fetchall()
        return jsonify(logs), 200
   
    except Exception as e:
        return jsonify({"error": str(e)}), 500
   
    finally:
        cursor.close()
        conn.close()

def render_logs_pack(app):
    app.add_url_rule('/get-all-logs', 'get_logs_api', get_logs, methods=['GET'])
    return app