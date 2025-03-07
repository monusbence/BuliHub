import React, { useState } from "react";
import "./Navbar.css";

interface NavbarProps {
  user?: { fullName: string } | null;
  onLogout?: () => void;
  onRegisterClick?: () => void;
}

/**
 * Általános felső navbar, hamburger menüvel mobil nézetben.
 */
const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout = () => {},
  onRegisterClick = () => {},
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src="./kepek_jegyzetek/MainLogo(png).png" alt="BuliHub Logo" />
      </div>

      {/* Hamburger ikon */}
      <div
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Linkek */}
      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <li>
          <a href="/" onClick={toggleMenu}>
            Főoldal
          </a>
        </li>
        <li>
          <a href="/events" onClick={toggleMenu}>
            Események
          </a>
        </li>
        <li>
          <a href="/contact" onClick={toggleMenu}>
            Kapcsolat
          </a>
        </li>
        <li>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onRegisterClick();
              toggleMenu();
            }}
          >
            Regisztráció
          </a>
        </li>
      </ul>

      {/* Bejelentkezett felhasználó (jobbra igazítva) */}
      {user && (
        <div className="user-info">
          <span>{user.fullName}</span>
          <button className="logout-btn" onClick={onLogout}>
            Kijelentkezés
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
