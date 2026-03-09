import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

def get_connection():
    return psycopg2.connect(os.getenv("DATABASE_URL"))

def get_schema() -> str:
    """Returns database schema so Claude understands the structure"""
    return """
    Database Schema:
    
    TABLE customers (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        email VARCHAR(100),
        city VARCHAR(50),
        country VARCHAR(50),
        created_at DATE
    )
    
    TABLE products (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100),
        category VARCHAR(50),
        price NUMERIC(10,2),
        stock INTEGER
    )
    
    TABLE orders (
        id SERIAL PRIMARY KEY,
        customer_id INTEGER REFERENCES customers(id),
        product_id INTEGER REFERENCES products(id),
        quantity INTEGER,
        total_amount NUMERIC(10,2),
        order_date DATE,
        status VARCHAR(20) -- values: completed, pending
    )
    """

def execute_query(sql: str) -> dict:
    """Execute a SQL query and return results"""
    conn = None
    try:
        conn = get_connection()
        cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cursor.execute(sql)
        rows = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        return {
            "success": True,
            "columns": columns,
            "rows": [dict(row) for row in rows],
            "row_count": len(rows)
        }
    except Exception as e:
        return {
            "success": False,
            "error": str(e),
            "columns": [],
            "rows": [],
            "row_count": 0
        }
    finally:
        if conn:
            conn.close()