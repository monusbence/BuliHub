import React from "react";
import "./Navbar.css";

interface NavbarProps {
  user: { fullName: string } | null;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  onLogout: () => void;
  onRegisterClick: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  isMenuOpen,
  toggleMenu,
  onLogout,
  onRegisterClick,
}) => {
  return (
    <nav className="navbar">
      <div className="logo">
        <img src="./kepek_jegyzetek/MainLogo(png).png" alt="BuliHub Logo" />
      </div>

      <div
        className={`hamburger ${isMenuOpen ? "active" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <li>
          <a href="#section1" onClick={toggleMenu}>
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
            }}
          >
            Regisztráció
          </a>
        </li>
      </ul>

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
