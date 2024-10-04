import React, { useState } from "react";
import { TbSquareRoundedPlusFilled } from "react-icons/tb";
const tableSchema = {
  employees: [
    { name: "emp_no", type: "INTEGER" },
    { name: "birth_date", type: "date" },
    { name: "first_name", type: "varchar(14)" },
    { name: "last_name", type: "varchar(16)" },
    { name: "gender", type: "TEXT" },
    { name: "hire_date", type: "date" },
  ],
  departments: [
    { name: "dept_no", type: "char(4)" },
    { name: "dept_name", type: "varchar(40)" },
  ],
  dept_emp: [
    { name: "emp_no", type: "INTEGER" },
    { name: "dept_no", type: "char(4)" },
    { name: "from_date", type: "date" },
    { name: "to_date", type: "date" },
  ],
  dept_manager: [
    { name: "dept_no", type: "char(4)" },
    { name: "emp_no", type: "INTEGER" },
    { name: "from_date", type: "date" },
    { name: "to_date", type: "date" },
  ],
  salaries: [
    { name: "emp_no", type: "INTEGER" },
    { name: "salary", type: "INTEGER" },
    { name: "from_date", type: "date" },
    { name: "to_date", type: "date" },
  ],
  titles: [
    { name: "emp_no", type: "INTEGER" },
    { name: "title", type: "varchar(50)" },
    { name: "from_date", type: "date" },
    { name: "to_date", type: "date", nullable: true },
  ],
};

const DbForm = () => {
  const [selectedTable, setSelectedTable] = useState("");
  const [formData, setFormData] = useState({});

  const handleTableChange = (event) => {
    setSelectedTable(event.target.value);
    setFormData({});
  };

  const handleInputChange = (column, value) => {
    setFormData({ ...formData, [column]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTable) {
      alert("Please select a table.");
      return;
    }

    try {
      const response = await fetch("http://localhost:3001/api/insert-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ table: selectedTable, data: formData }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Data inserted successfully!");
        setFormData({});
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      console.error("Error inserting data:", error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="data_entry_form">
        <h3>Select Table to Insert Data</h3>
        <select value={selectedTable} onChange={handleTableChange}>
          <option value="">Select Table</option>
          {Object.keys(tableSchema).map((table) => (
            <option key={table} value={table}>
              {table}
            </option>
          ))}
        </select>

        {selectedTable && (
          <>
            <h4>Enter Data for {selectedTable} Table</h4>
            {tableSchema[selectedTable].map((column, index) => (
              <div key={index}>
                <label>{column.name}:</label>
                <input
                  type={column.type === "date" ? "date" : "text"}
                  placeholder={`Enter ${column.name}`}
                  value={formData[column.name] || ""}
                  onChange={(e) =>
                    handleInputChange(column.name, e.target.value)
                  }
                />
              </div>
            ))}
          </>
        )}

        <button type="submit">
          <TbSquareRoundedPlusFilled />
          Add
        </button>
      </form>
    </div>
  );
};

export default DbForm;
