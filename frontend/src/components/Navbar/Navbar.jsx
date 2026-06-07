import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "FCFS", path: "/FCFS" },
    { name: "SJF", path: "/SJF" },
    { name: "SRTF", path: "/SRTF" },
    { name: "Priority", path: "/Priority" },
    { name: "Round Robin", path: "/RoundRobin" },
    { name: "Sorting", path: "/sorting" },
    { name: "Graph Grid", path: "/graph" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span> AlgoVisualizer
        </Link>
        <button className="menu-toggle" onClick={toggleMenu} aria-label="Toggle menu">
          <span className={`hamburger ${isOpen ? "open" : ""}`}></span>
        </button>
        <ul className={`nav-menu ${isOpen ? "active" : ""}`}>
          {navLinks.map((link) => (
            <li key={link.path} className="nav-item">
              <Link
                to={link.path}
                className={`nav-link ${location.pathname === link.path ? "active" : ""}`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
