# GST Data Flask Server

A simple Flask server that retrieves data from a MySQL database based on GST_IN.

## Setup

1. Make sure you have Python installed (3.7 or higher recommended)
2. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```
3. Configure your MySQL database:
   - Create a database
   - Create the testcases table using the following SQL:
   ```sql
   CREATE TABLE testcases (
       GST_IN VARCHAR(15) PRIMARY KEY,
       Annual_Revenue INT,
       Loan_Amount INT,
       GST_Compliance INT,
       Past_Defaults INT,
       Bank_Transactions VARCHAR(20),
       Market_Trend INT,
       Financial_Health FLOAT,
       Repayment_History INT,
       Credit_Utilization FLOAT,
       Industry_Risk INT
   );
   ```
   - Update the DB_CONFIG in app.py with your database credentials

## Running the Server

Run the server with:
```
python app.py
```

The server will start on http://localhost:5000

## API Endpoints

### Get Testcase Data by GST_IN

**Endpoint:** `/get_testcase`

**Method:** GET

**Query Parameters:**
- `gst_in`: The GST_IN value to search for (required)

**Example Request:**
```
GET http://localhost:5000/get_testcase?gst_in=ABCDE1234F
```

**Example Response:**
```json
{
  "GST_IN": "ABCDE1234F",
  "Annual_Revenue": 5000000,
  "Loan_Amount": 1000000,
  "GST_Compliance": 1,
  "Past_Defaults": 0,
  "Bank_Transactions": "High",
  "Market_Trend": 2,
  "Financial_Health": 0.85,
  "Repayment_History": 1,
  "Credit_Utilization": 0.6,
  "Industry_Risk": 1
}
``` 