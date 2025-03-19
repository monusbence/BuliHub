import React from "react";
import "./Navbar.css";

interface NavbarProps {
  user?: { fullName: string; email?: string } | null;
  onLogout?: () => void;
  onRegisterClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  user,
  onLogout = () => {},
  onRegisterClick = () => {},
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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

        {/* Csak akkor jelenjen meg a „Profilom” link, ha be van jelentkezve */}
        {user && (
          <li>
            <a href="/profile" className="profile-link" onClick={toggleMenu}>
              Profilom
            </a>
          </li>
        )}

        {/* Regisztráció gomb – bejelentkezve inaktív, különben kattintható */}
        {user ? (
          <li>
            <a href="#" className="disabled" onClick={(e) => e.preventDefault()}>
              Regisztráció
            </a>
          </li>
        ) : (
          <li>
            <a
              href="#"
              onClick={() => {
                onRegisterClick();
                toggleMenu();
              }}
            >
              Regisztráció
            </a>
          </li>
        )}
      </ul>

      {/* A felhasználó neve és a kijelentkezés gomb csak bejelentkezve jelenik meg */}
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
