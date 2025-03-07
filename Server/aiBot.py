# app.py - FastAPI Backend
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import os
import google.generativeai as genai
from dotenv import load_dotenv
from pydantic import BaseModel
import json

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = "AIzaSyBXxkyId3J2jEmv00WM0Erv0enZc6ybW1s"

# Configure Gemini API
genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

# Initialize FastAPI app
app = FastAPI(title="AI Credit Scoring ChatBot API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React development server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample Business Credit Data (Mock JSON)
sample_business_data = {
    "business_id": "XYZ123",
    "business_name": "XYZ Pvt Ltd",
    "credit_score": 720,
    "risk_factors": {
        "late_payments": "2 in last 6 months",
        "cash_flow_variability": "Moderate fluctuations",
        "high_debt_ratio": "45% of revenue"
    },
    "financial_summary": {
        "monthly_revenue": 500000,
        "profit_margin": 18,
        "loan_repayment_history": "Good"
    },
    "default_risk_prediction": {
        "probability": 0.12,
        "risk_category": "Low"
    },
    "explanation": "The credit score is strong, but slightly impacted by late payments. The business has stable revenue, a good repayment history, and a low default risk."
}

# Chat session store
session_store = {}


# Request models
class BusinessIdRequest(BaseModel):
    businessId: str


class ChatRequest(BaseModel):
    businessData: dict
    userMessage: str


# Routes
@app.post("/api/load-business-data")
async def load_business_data(request: BusinessIdRequest):
    if request.businessId == "XYZ123":
        # In a real app, you would query a database here
        return sample_business_data
    else:
        raise HTTPException(status_code=404, detail="Business ID not found")


@app.post("/api/chat")
async def chat(request: ChatRequest):
    business_data = request.businessData
    user_message = request.userMessage

    # Generate a unique session ID based on business ID
    session_id = business_data.get("business_id", "unknown")

    # Create or get existing chat session
    if session_id not in session_store:
        session_store[session_id] = model.start_chat(history=[])

    # Prepare the prompt with business data and user question
    ai_query = f"""
    Here is the business financial data in JSON format:
    {json.dumps(business_data, indent=2)}

    The user asked: {user_message}
    Answer based on the provided data.
    """

    try:
        # Send message to Gemini AI
        gemini_response = session_store[session_id].send_message(ai_query)
        return {"response": gemini_response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


@app.get("/")
async def root():
    return {"message": "AI Credit Scoring ChatBot API is running"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)