// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DbForm from "./screens/db_form";
import DbChat from "./screens/db_chat";
import Header from "./screens/header";
import "./screens/styles.css";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/data_entry" element={<DbForm />} />
        <Route path="/" element={<DbChat />} />
      </Routes>
    </Router>
  );
};

export default App;
