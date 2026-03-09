import { useState } from "react";

const API_URL = "http://localhost:8000";

const SAMPLE_QUESTIONS = [
  "Show me all customers from UAE",
  "What are the top 5 most expensive products?",
  "How many orders are pending?",
  "Show me total sales per customer",
  "Which products are low in stock less than 50?",
  "Show me all completed orders with customer names",
  "What is the total revenue from completed orders?",
  "Show me customers who have placed more than one order"
];

export default function App() {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleQuery = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${API_URL}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "Query failed");
      }
    } catch (err) {
      setError("Cannot connect to API. Make sure backend is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Natural Language to SQL
          </h1>
          <p className="text-gray-400">
            Ask questions in plain English — Claude AI converts them to SQL and runs them instantly
          </p>
          <div className="mt-2 text-sm text-gray-500">
            Powered by Anthropic Messages API — claude-opus-4-6
          </div>
        </div>

        {/* Input Section */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Ask a question about the database
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleQuery()}
              placeholder="e.g. Show me all customers from UAE"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
            <button
              onClick={handleQuery}
              disabled={loading || !question.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {loading ? "Running..." : "Run Query"}
            </button>
          </div>
        </div>

        {/* Sample Questions */}
        <div className="bg-gray-900 rounded-xl p-6 mb-6 border border-gray-800">
          <h2 className="text-sm font-medium text-gray-400 mb-3">
            Sample Questions — click to try
          </h2>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_QUESTIONS.map((q, i) => (
              <button
                key={i}
                onClick={() => setQuestion(q)}
                className="bg-gray-800 hover:bg-gray-700 text-gray-300 text-sm px-3 py-1.5 rounded-lg border border-gray-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-950 border border-red-800 rounded-xl p-4 mb-6 text-red-400">
            Error: {error}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-4">
            {/* Generated SQL */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-sm font-medium text-gray-400 mb-3">
                Generated SQL Query
              </h2>
              <pre className="bg-gray-800 rounded-lg p-4 text-green-400 text-sm overflow-x-auto whitespace-pre-wrap">
                {result.sql}
              </pre>
            </div>

            {/* Results Table */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-sm font-medium text-gray-400">
                  Query Results
                </h2>
                <span className="text-sm text-gray-500">
                  {result.row_count} row{result.row_count !== 1 ? "s" : ""} returned
                </span>
              </div>
              {result.rows.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        {result.columns.map((col, i) => (
                          <th key={i} className="text-left py-2 px-3 text-gray-400 font-medium">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {result.rows.map((row, i) => (
                        <tr key={i} className="border-b border-gray-800 hover:bg-gray-800 transition-colors">
                          {result.columns.map((col, j) => (
                            <td key={j} className="py-2 px-3 text-gray-300">
                              {row[col] !== null ? String(row[col]) : "NULL"}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No results found</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}