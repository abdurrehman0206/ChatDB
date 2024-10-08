import React, { useState, useEffect } from "react";
import { FaCircleArrowUp, FaMicrophone } from "react-icons/fa6";
import MapComponent from "./map_component";

const DbChat = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
  const [resultData, setResultData] = useState([]); // Store query results
  const [page, setPage] = useState(1); // Track the current page
  const rowsPerPage = 50; // Number of rows per page
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [locations, setLocations] = useState([]);
  const [mapKey, setMapKey] = useState(0);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recog = new SpeechRecognition();
      recog.continuous = false; // Set to true for continuous recognition
      recog.interimResults = false; // Set to true to get interim results
      recog.lang = "en-US"; // Set your preferred language

      recog.onstart = () => {
        setIsListening(true);
      };

      recog.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        setIsListening(false);
      };

      recog.onend = () => {
        setIsListening(false);
      };

      setRecognition(recog);
    }
  }, []);

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
          query,
          limit: rowsPerPage,
          offset: (pageNum - 1) * rowsPerPage,
        }),
      });

      const result = await dbRes.json();

      if (dbRes.ok && result.data) {
        setResponse(result.sql || "");
        setResultData(result.data);

        const locData = result.data
          .filter((row) => row.x !== undefined && row.y !== undefined)
          .map((row) => ({
            firstName: row.first_name,
            lastName: row.last_name,
            location: row.location,
            x: row.x,
            y: row.y,
          }));

        if (locData.length > 0) {
          setLocations(locData);
          setMapKey(mapKey + 1);
        } else {
          setLocations([]);
        }
      } else {
        setResultData([]);
        setResponse("No results found.");
        setLocations([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setResponse("Failed to generate SQL.");
      setResultData([]);
      setLocations([]);
    }
  };

  const handleNextPage = () => {
    setPage((prevPage) => {
      const nextPage = prevPage + 1;
      fetchData(nextPage);
      return nextPage;
    });
  };

  const handlePreviousPage = () => {
    setPage((prevPage) => {
      const prev = prevPage - 1 > 0 ? prevPage - 1 : 1;
      fetchData(prev);
      return prev;
    });
  };

  const handleMicClick = () => {
    if (recognition) {
      if (isListening) {
        recognition.stop();
      } else {
        recognition.start();
      }
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleQuerySubmit}>
        <div className="chat-bar">
          <input
            type="text"
            placeholder="Message ChatDB"
            value={query}
            onChange={handleQueryChange}
          />
          <button
            type="button"
            onClick={handleMicClick}
            className={`mic-icon ${isListening ? "active" : ""}`}
          >
            <FaMicrophone />
          </button>
          <button type="submit" className="submit-icon">
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
      {/* Map output section */}
      {locations.length > 0 && (
        <div className="map-output">
          <h2>Location</h2>
          <MapComponent locations={locations} mapKey={mapKey} />
        </div>
      )}
    </div>
  );
};

export default DbChat;
