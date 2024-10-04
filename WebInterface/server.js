const express = require("express");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const axios = require("axios");
const config = require("./config_path.js");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to SQLite database (using employee_demo.db)
const db = new sqlite3.Database(config.databasePath, (err) => {
  if (err) {
    console.error("Error opening database", err.message);
  } else {
    console.log("Connected to the employee_demo.db SQLite database.");
  }
});

// Route to insert data into a selected table
app.post("/api/insert-data", (req, res) => {
  const { table, data } = req.body;

  if (!table || Object.keys(data).length === 0) {
    return res
      .status(400)
      .json({ error: "Table and data are required to insert" });
  }

  // Log the table name and data being inserted
  console.log(`Attempting to insert into table: ${table}`);
  console.log("Data:", data);

  // Check if the table exists
  db.get(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    [table],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      if (!row) {
        return res
          .status(400)
          .json({ error: `Table ${table} does not exist.` });
      }

      // Create a parameterized query to insert data
      const columns = Object.keys(data);
      const placeholders = columns.map(() => "?").join(",");
      const values = columns.map((col) => data[col]);

      const insertQuery = `INSERT INTO ${table} (${columns.join(
        ","
      )}) VALUES (${placeholders})`;

      // Log the SQL query
      console.log("SQL Query:", insertQuery);

      db.run(insertQuery, values, function (err) {
        if (err) {
          console.error("Error inserting data:", err.message);
          return res.status(500).json({ error: err.message });
        }
        res.json({ message: "Data inserted successfully", id: this.lastID });
      });
    }
  );
});

// Function to translate input to English using MyMemory
async function translateToEnglish(text) {
  try {
    const response = await axios.get(
      "https://api.mymemory.translated.net/get",
      {
        params: {
          q: text,
          langpair: "ar|en",
        },
      }
    );

    // Log the full response for debugging
    console.log("Translation API Response:", response.data);

    // Check if the response contains translated text
    if (response.data && response.data.responseData) {
      return response.data.responseData.translatedText;
    } else {
      throw new Error("Translation response is malformed.");
    }
  } catch (error) {
    console.error("Translation error:", error);
    throw new Error("Translation failed.");
  }
}

// Route to handle text-to-SQL conversion
app.post("/api/query", async (req, res) => {
  const { query, limit = 50, offset = 0 } = req.body; // Default to 50 rows per page

  if (!query) {
    return res.status(400).json({ error: "Query is required." });
  }

  try {
    // Translate the input query to English
    const translatedQuery = await translateToEnglish(query);
    console.log("Translated query:", translatedQuery); // Log the translated query

    // Send the translated query to the text-to-SQL model
    const response = await axios.post("http://localhost:5000/api/text-to-sql", {
      query: translatedQuery,
    });

    const data = response.data; // Get the response data
    console.log("Generated SQL:", data.sql); // Log the generated SQL

    if (data.sql) {
      // Modify the SQL query to add pagination using LIMIT and OFFSET
      const paginatedSQL = `${data.sql} LIMIT ${limit} OFFSET ${offset}`;

      // Execute the paginated SQL query on the database
      db.all(paginatedSQL, [], (err, rows) => {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ data: rows });
      });
    } else {
      res.status(400).json({ error: "Failed to generate SQL." });
    }
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
