# This is a sample Python script.

# Press Ctrl+F5 to execute it or replace it with your code.
# Press Double Shift to search everywhere for classes, files, tool windows, actions, and settings.

from flask import Flask, request, jsonify
import mysql.connector
from mysql.connector import Error
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler



app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

def predict_credit_score(test_case_dict):
    """
    Predicts the credit score based on the input test case dictionary.

    Parameters:
    - test_case_dict (dict): A dictionary containing feature values.

    Returns:
    - float: Predicted credit score.
    """
    try:
        # Load saved model and scaler
        model_path = "ai_models/gradient_boosting_model.joblib"  # Update path to where your model is stored
        scaler_path = "ai_models/scaler.joblib"  # Update path to where your scaler is stored
        
        try:
            model = joblib.load(model_path)
            scaler = joblib.load(scaler_path)
        except FileNotFoundError:
            # If model files not found, return a default credit score
            print(f"Model files not found at {model_path} or {scaler_path}. Returning default score.")
            return 650  # Default credit score
        
        # Create a copy of the dictionary to avoid modifying the original
        features = test_case_dict.copy()
        
        # Map database column names to model column names
        column_mapping = {
            'Annual_Revenue': 'Annual Revenue',
            'Loan_Amount': 'Loan Amount',
            'GST_Compliance': 'GST Compliance (%)',
            'Past_Defaults': 'Past Defaults',
            'Bank_Transactions': 'Bank Transactions',
            'Market_Trend': 'Market Trend',
            'Financial_Health': 'financial_health',
            'Repayment_History': 'repayment_history',
            'Credit_Utilization': 'credit_utilization',
            'Industry_Risk': 'industry_risk'
        }
        
        # Create a new dictionary with the mapped column names
        mapped_features = {}
        for db_col, model_col in column_mapping.items():
            if db_col in features:
                mapped_features[model_col] = features[db_col]
        
        # Convert dictionary to DataFrame
        test_case_df = pd.DataFrame([mapped_features])
        
        # Define categorical encodings (ensure they match training encodings)
        label_encodings = {
            "Bank Transactions": {"High Volume": 0, "Low Volume": 1, "Unstable": 2},
            "Market Trend": {"Declining": 0, "Growth": 1, "Stable": 2}  # Numeric values
        }
        
        # Convert categorical values if needed
        if "Bank Transactions" in test_case_df.columns:
            if test_case_df["Bank Transactions"].iloc[0] in label_encodings["Bank Transactions"]:
                test_case_df["Bank Transactions"] = test_case_df["Bank Transactions"].map(
                    lambda x: label_encodings["Bank Transactions"].get(x, x)
                )
        
        print(f"Features being used for prediction: {test_case_df.columns.tolist()}")
        
        # Scale the input using the saved scaler
        test_case_scaled = scaler.transform(test_case_df)

        # Predict using the loaded model
        predicted_credit_score = model.predict(test_case_scaled)

        return predicted_credit_score[0]
    
    except Exception as e:
        print(f"Error in predict_credit_score: {str(e)}")
        # Return a default credit score in case of any error
        return 650  # Default credit score


# Database connection configuration
DB_CONFIG = {
    'host': 'localhost',
    'database': 'creditai',  # Replace with your actual database name
    'user': 'root',                    # Replace with your MySQL username
    'password': 'Omkar@2004',                    # Replace with your MySQL password
    'port': 3306                       # Default MySQL port
}


def get_testcase1(gst_in):
    """Get testcase data by GST_IN and return as a dictionary"""

    if not gst_in:
        return {"error": "GST_IN parameter is required"}

    connection = get_db_connection()
    if not connection:
        return {"error": "Database connection failed"}

    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM testcases WHERE GST_IN = %s"
        cursor.execute(query, (gst_in,))
        result = cursor.fetchone()

        if result:
            # Print the result for debugging
            print(f"get_testcase1 result: {result}")
            return result
        else:
            return {"error": "No data found for the provided GST_IN"}

    except Error as e:
        return {"error": f"Database error: {str(e)}"}

    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

def get_db_connection():
    """Create and return a database connection"""
    try:
        connection = mysql.connector.connect(**DB_CONFIG)
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"Error connecting to MySQL: {e}")
        return None

@app.route('/get_testcase', methods=['GET'])
def get_testcase():
    """Endpoint to get testcase data by GST_IN"""
    gst_in = request.args.get('gst_in')
    
    if not gst_in:
        return jsonify({"error": "GST_IN parameter is required"}), 400
    
    connection = get_db_connection()
    if not connection:
        return jsonify({"error": "Database connection failed"}), 500
    
    try:
        cursor = connection.cursor(dictionary=True)
        query = "SELECT * FROM testcases WHERE GST_IN = %s"
        cursor.execute(query, (gst_in,))
        result = cursor.fetchone()
        
        if result:
            # Print the result for debugging
            print(f"Database result: {result}")
            return jsonify(result)
        else:
            return jsonify({"error": "No data found for the provided GST_IN"}), 404
    
    except Error as e:
        return jsonify({"error": f"Database error: {str(e)}"}), 500
    
    finally:
        if connection.is_connected():
            cursor.close()
            connection.close()

@app.route('/get_credit_score', methods=['GET'])
def get_credit_score():
    gst_in = request.args.get('gst_in')
    if not gst_in:
        return jsonify({"error": "GST_IN parameter is required"}), 400
    
    testcase_data = get_testcase1(gst_in)
    if testcase_data and 'error' in testcase_data:
        return jsonify(testcase_data), 404 if "No data found" in testcase_data['error'] else 500
    
    credit_score = predict_credit_score(testcase_data)
    credit_score = round(credit_score, 0)
    return jsonify({"credit_score": credit_score})


@app.route('/post_credit_data', methods=['POST'])
def post_credit_data():
    # store into the database
    # User_ID	GST_IN	Annual Revenue	Loan Amount	GST Compliance (%)	Past Defaults	Bank Transactions	Market Trend	Credit Score	financial_health	repayment_history	credit_utilization	industry_risk
    data = request.json
    print(data)
    # Store in sql database
    connection = get_db_connection()
    cursor = connection.cursor()
    # if not contains credit_data table then create it
    cursor.execute("CREATE TABLE IF NOT EXISTS credit_data (User_ID INT, GST_IN VARCHAR(255), Annual_Revenue FLOAT, Loan_Amount FLOAT, GST_Compliance FLOAT, Past_Defaults FLOAT, Bank_Transactions VARCHAR(100), Market_Trend FLOAT, Credit_Score FLOAT, financial_health FLOAT, repayment_history FLOAT, credit_utilization FLOAT, industry_risk FLOAT)")
    query = "INSERT INTO credit_data (User_ID, GST_IN, Annual_Revenue, Loan_Amount, GST_Compliance, Past_Defaults, Bank_Transactions, Market_Trend, Credit_Score, financial_health, repayment_history, credit_utilization, industry_risk) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"
    cursor.execute(query, (data['user_id'], data['gst_in'], data['annual_revenue'], data['loan_amount'], data['gst_compliance'], data['past_defaults'], data['bank_transactions'], data['market_trend'], data['credit_score'], data['financial_health'], data['repayment_history'], data['credit_utilization'], data['industry_risk']))
    connection.commit()
    cursor.close()
    connection.close()
    return jsonify({"message": "Data stored successfully"}), 200


@app.route('/get_social_analysis', methods=['GET'])
def get_social_analysis():
    gst_in = request.args.get('gst_in')
    if not gst_in:
        return jsonify({"error": "GST_IN parameter is required"}), 400
    
    # call socialmedia table for gst_in
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)
    query = "SELECT * FROM socialmedia WHERE GST_IN = %s"
    cursor.execute(query, (gst_in,))
    result = cursor.fetchone()
    if result:
        return jsonify(result)
    else:
        return jsonify({"error": "No data found for the provided GST_IN"}), 404
    

    
    




@app.route('/')
def home():
    return """
    <h1>GST Testcase API</h1>
    <p>Use /get_testcase?gst_in=YOUR_GST_IN to retrieve data</p>
    """

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)

# See PyCharm help at https://www.jetbrains.com/help/pycharm/
