import anthropic
import os
from dotenv import load_dotenv
from database import get_schema

load_dotenv()

client = anthropic.Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))

def generate_sql(natural_language_query: str) -> dict:
    """Convert natural language to SQL using Claude API"""

    schema = get_schema()

    prompt = f"""You are an expert SQL developer. Convert the following natural language question into a valid PostgreSQL query.

{schema}

Rules:
- Generate only SELECT queries, never INSERT, UPDATE, DELETE or DROP
- Use proper JOIN syntax when querying multiple tables
- Always use table aliases for clarity
- Limit results to 100 rows maximum unless user specifies otherwise
- Return only the SQL query, no explanation

Natural language question: {natural_language_query}

Return only the SQL query, nothing else."""

    response = client.messages.create(
        model="claude-opus-4-6",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )

    sql = response.content[0].text.strip()
    sql = sql.replace("```sql", "").replace("```", "").strip()

    return {
        "natural_language": natural_language_query,
        "sql": sql
    }