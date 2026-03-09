from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sql_generator import generate_sql
from database import execute_query

app = FastAPI(
    title="Natural Language to SQL API",
    description="Convert plain English questions to SQL using Claude API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    question: str

@app.get("/")
def root():
    return {"message": "NL to SQL API is running", "status": "healthy"}

@app.post("/query")
def query(request: QueryRequest):
    """Convert natural language to SQL and execute it"""

    if not request.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")

    # Step 1 - Generate SQL from natural language
    generated = generate_sql(request.question)
    sql = generated["sql"]

    # Step 2 - Execute the generated SQL
    result = execute_query(sql)

    return {
        "question": request.question,
        "sql": sql,
        "success": result["success"],
        "columns": result.get("columns", []),
        "rows": result.get("rows", []),
        "row_count": result.get("row_count", 0),
        "error": result.get("error")
    }

@app.get("/sample-questions")
def sample_questions():
    """Returns sample questions users can ask"""
    return {
        "questions": [
            "Show me all customers from UAE",
            "What are the top 5 most expensive products?",
            "How many orders are pending?",
            "Show me total sales per customer",
            "Which products are low in stock (less than 50)?",
            "Show me all completed orders with customer names",
            "What is the total revenue from completed orders?",
            "Show me customers who have placed more than one order"
        ]
    }