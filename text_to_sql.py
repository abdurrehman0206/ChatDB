import sqlite3
import torch
from transformers import AutoModelForSeq2SeqLM, AutoTokenizer
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the text-to-SQL model
model_path = 'gaussalgo/T5-LM-Large-text2sql-spider'
tokenizer = AutoTokenizer.from_pretrained(model_path)
model = AutoModelForSeq2SeqLM.from_pretrained(model_path)

# Database path
db_path = 'Z:/ReactJS/ChatDB/employee_demo.db'

def get_schema():
    """Fetch the schema from the SQLite database."""
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Query to get the table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = cursor.fetchall()

    schema = ""
    for table in tables:
        table_name = table[0]
        cursor.execute(f"PRAGMA table_info({table_name});")
        columns = cursor.fetchall()
        
        # Fetch column name and type for each table
        column_descriptions = ", ".join([f'{col[1]} {col[2]}' for col in columns])
        schema += f'"{table_name}" {column_descriptions} [SEP] '

    conn.close()
    return schema.strip()

@app.route('/api/text-to-sql', methods=['POST'])
def text_to_sql():
    data = request.json
    natural_query = data.get('query', '')

    # Fetch the schema automatically from the SQLite database
    db_schema = get_schema()

    # Create the input text for the model
    input_text = f"Question: {natural_query} Schema: {db_schema}"

    # Tokenize the input
    model_inputs = tokenizer(input_text, return_tensors="pt")

    # Generate SQL query
    outputs = model.generate(**model_inputs, max_length=512)
    output_text = tokenizer.batch_decode(outputs, skip_special_tokens=True)

    print("Generated SQL:", output_text[0])

    # Return the generated SQL
    return jsonify({'sql': output_text[0]})

if __name__ == '__main__':
    app.run(port=5000)
