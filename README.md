# Natural Language to SQL — Claude API + FastAPI + React

An AI-powered web app that converts plain English questions into SQL 
queries and executes them against a real PostgreSQL database instantly.

## How It Works
1. User types a natural language question in the React frontend
2. Frontend sends question to FastAPI backend
3. Anthropic Messages API (/v1/messages) using model claude-opus-4-6 converts question to SQL
4. SQL executes against PostgreSQL database
5. Results displayed in a clean table

## Tech Stack
- Python + FastAPI (REST API backend)
- Anthropic Messages API — model: claude-opus-4-6
- PostgreSQL (database)
- React.js (frontend)
- Tailwind CSS (styling)
- Uvicorn (ASGI server)

## Project Structure
nl-to-sql/
├── backend/
│   ├── main.py            ← FastAPI endpoints
│   ├── sql_generator.py   ← Claude NL to SQL logic
│   ├── database.py        ← PostgreSQL connection
│   ├── .env               ← API keys (not committed)
│   └── .env.example       ← Environment template
└── frontend/
    └── src/
        └── App.js         ← React UI

## Database Schema
- customers — name, email, city, country
- products — name, category, price, stock
- orders — customer_id, product_id, quantity, total_amount, status

## Sample Questions
- Show me all customers from UAE
- What are the top 5 most expensive products?
- What is the total revenue from completed orders?
- Show me all completed orders with customer names
- Which products are low in stock less than 50?
- Show me customers who have placed more than one order

## Setup Instructions

### Backend
1. cd backend
2. python -m venv venv
3. venv\Scripts\activate
4. pip install -r requirements.txt
5. Create .env file (see .env.example)
6. uvicorn main:app --reload --port 8000

### Frontend
1. cd frontend
2. npm install
3. npm start

## API Endpoints
- GET  /                  — Health check
- POST /query             — Convert NL to SQL and execute
- GET  /sample-questions  — Get sample questions

## Environment Variables
See backend/.env.example