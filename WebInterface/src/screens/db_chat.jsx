import React, { useState } from "react";

import { FaCircleArrowUp } from "react-icons/fa6";
const DbChat = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [resultData, setResultData] = useState([]); // Store query results
  const [page, setPage] = useState(1); // Track the current page
  const rowsPerPage = 50; // Number of rows per page

  const handleQueryChange = (e) => {
    setQuery(e.target.value);
  };

  const handleQuerySubmit = async (e) => {
    e.preventDefault();
    setPage(1); // Reset to the first page when submitting a new query
    await fetchData(1); // Fetch the first page of results
  };

  const fetchData = async (pageNum) => {
    try {
      const dbRes = await fetch("http://localhost:3001/api/query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query, // Send the query directly to the backend
          limit: rowsPerPage, // Limit the number of rows per page
          offset: (pageNum - 1) * rowsPerPage, // Calculate the offset
        }),
      });

      const result = await dbRes.json();

      if (dbRes.ok && result.data) {
        // Assuming result.data is an array of objects
        setResponse(result.sql || ""); // Assuming SQL query is returned in result.sql
        setResultData(result.data); // Store the result data
      } else {
        setResultData([]);
        setResponse("No results found.");
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Failed to generate SQL.");
      setResultData([]);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchData(nextPage); // Fetch the next page of results
      return nextPage;
    });
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => {
      const prev = prevPage - 1 > 0 ? prevPage - 1 : 1;
      fetchData(prev); // Fetch the previous page of results
      return prev;
    });
  };

  return (
    <div className="container">
      <form onSubmit={handleQuerySubmit}>
        <div className="chat-bar">
          <input
            className=""
            type="text"
            placeholder="Message ChatDB"
            value={query}
            onChange={handleQueryChange}
          />
          <button type="submit">
            <FaCircleArrowUp />
          </button>
        </div>
      </form>

      {response && (
        <div className="result-box">
          <p>
            <strong>SQL Query:</strong>{" "}
            {typeof response === "string" ? response : JSON.stringify(response)}
          </p>
        </div>
      )}

      {resultData.length > 0 && (
        <>
          <table className="result-table">
            <thead>
              <tr>
                {Object.keys(resultData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resultData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, i) => (
                    <td key={i}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="pagination-controls">
            <button onClick={handlePreviousPage} disabled={page === 1}>
              Previous
            </button>
            <span>Page {page}</span>
            <button onClick={handleNextPage}>Next</button>
          </div>
        </>
      )}

      {resultData.length === 0 && response && <p>No results to display.</p>}
    </div>
  );
};

export default DbChat;
