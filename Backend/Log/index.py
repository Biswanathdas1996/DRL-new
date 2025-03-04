from datetime import datetime
from secretes.secrets import DB_CONFIG
import psycopg2
from psycopg2 import  OperationalError
import matplotlib
matplotlib.use('Agg')
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
        return result[0]
       
    except Exception as e:
        connection.rollback()
        print(e)
        return None
   
    finally:
        cursor.close()
        connection.close()

def update_feedback():
    """
    Update the feedback for a specific log entry.
    This function retrieves JSON data from the request, extracts the log ID, feedback, and comment,
    and updates the corresponding log entry in the database with the new feedback. It returns a JSON
    response indicating the success or failure of the operation.
    Returns:
        Response: A JSON response with the updated log entry details and a status code of 200 if successful,
                  or an error message and appropriate status code if there is an error.
    Raises:
        Exception: If there is an error during the database operation, an exception is caught and a JSON
                   response with the error message and a status code of 500 is returned.
    """
    data = request.get_json()
    log_id = data.get('id')
    feedback = data.get('feedback')
    comment = data.get('comment')

    if not log_id or feedback is None:
        return jsonify({"error": "Invalid input"}), 400

    connection = create_connection(DB_CONFIG)
    cursor = connection.cursor()

    try:
        cursor.execute("""
            UPDATE conversation_log
            SET feedback = %s,
                comment = %s         
            WHERE id = %s
            RETURNING id, feedback;
        """, (feedback, comment, log_id))
        connection.commit()
        result = cursor.fetchone()
        if result:
            return jsonify({"id": result[0], "feedback": result[1]}), 200
        else:
            return jsonify({"error": "Log not found"}), 404

    except Exception as e:
        connection.rollback()
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        connection.close()

def get_logs():
    user_id = request.args.get('user_id')
    limit = request.args.get('limit', 100, type=int)  # Default limit to 100
    offset = request.args.get('offset', 0, type=int)  # Default offset to 0

    conn = create_connection(DB_CONFIG)
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        if user_id:
            cursor.execute("""
                SELECT DISTINCT cl.id, cl.user_id, ud.name, cl.userquery, cl.sqlquery, cl.timestamp, cl.feedback, cl.comment
                FROM conversation_log cl
                LEFT JOIN userdetails ud ON cl.user_id = ud.emp_code
                WHERE cl.user_id = %s
                ORDER BY cl.timestamp DESC
                LIMIT %s OFFSET %s;
            """, (user_id, limit, offset))
        else:
            cursor.execute("""
                SELECT DISTINCT cl.id,  cl.user_id, ud.name, cl.feedback, cl.comment, cl.userquery, cl.sqlquery, cl.timestamp
                FROM conversation_log cl
                LEFT JOIN userdetails ud ON cl.user_id = ud.emp_code
                ORDER BY cl.timestamp DESC
                LIMIT %s OFFSET %s;
            """, (limit, offset))

        logs = cursor.fetchall()
        return jsonify(logs), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()


def get_report():
  
    limit = request.args.get('limit', 100, type=int)  # Default limit to 100
    offset = request.args.get('offset', 0, type=int)  # Default offset to 0
    
    conn = create_connection(DB_CONFIG)
    cursor = conn.cursor(cursor_factory=RealDictCursor)

    try:
        # Convert date strings to a format that PostgreSQL can understand
        dates = request.args.get('dates', '').strip("[]").split(',')
        dates = [date.strip().strip("'") for date in dates if date]
        dates = [datetime.strptime(date, '%d-%m-%Y').date() for date in dates]

        if dates:
            cursor.execute("""
                SELECT DISTINCT cl.id, cl.user_id, ud.name, cl.feedback, cl.comment, cl.userquery, cl.sqlquery, cl.timestamp
                FROM conversation_log cl
                LEFT JOIN userdetails ud ON cl.user_id = ud.emp_code
                WHERE cl.timestamp::date = ANY(%s::date[])
                ORDER BY cl.timestamp DESC
                LIMIT %s OFFSET %s;
            """, (dates, limit, offset))
        else:
            cursor.execute("""
                SELECT DISTINCT cl.id, cl.user_id, ud.name, cl.feedback, cl.comment, cl.userquery, cl.sqlquery, cl.timestamp
                FROM conversation_log cl
                LEFT JOIN userdetails ud ON cl.user_id = ud.emp_code
                ORDER BY cl.timestamp DESC
                LIMIT %s OFFSET %s;
            """, (limit, offset))

        logs = cursor.fetchall()
        return jsonify(logs), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    finally:
        cursor.close()
        conn.close()






def render_logs_pack(app):
    app.add_url_rule('/get-all-logs', 'get_logs_api', get_logs, methods=['GET'])
    app.add_url_rule('/report', 'get_report_api', get_report, methods=['GET'])
    app.add_url_rule('/feedback', 'update_feedback_api', update_feedback, methods=['POST'])
    return app