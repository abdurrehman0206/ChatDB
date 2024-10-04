import React from "react";
import { Link } from "react-router-dom";
import { IoChatbubble } from "react-icons/io5";
import { FaDatabase } from "react-icons/fa";
import logo from "./db-logo.png";

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>
      <div className="nav-buttons">
        <Link to="/">
          <button className="nav-btn">
            <IoChatbubble />
            ChatDB
          </button>
        </Link>
        <Link to="/data_entry">
          <button className="nav-btn">
            <FaDatabase />
            Data Entry
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
