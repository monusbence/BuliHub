import React, { useState } from "react";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">BULIHUB</div>
      <div className="navbar-toggle" onClick={toggleNavbar}>
        ☰
      </div>
      <ul className={`navbar-links ${isOpen ? "active" : ""}`}>
        <li><a href="#home">Főoldal</a></li>
        <li><a href="#about">Rólunk</a></li>
        <li><a href="#services">Események</a></li>
        <li><a href="#portfolio">Szervezz bulit!</a></li>
        <li><a href="#contact">Kapcsolat</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;
