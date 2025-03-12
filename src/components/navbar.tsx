import React from "react";
import "./Navbar.css";

interface NavbarProps {
  user?: { fullName: string } | null;
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

  // Ha a felhasználó be van jelentkezve, a regisztrációs link le van tiltva.
  const handleRegisterClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault();
    if (!user) {
      onRegisterClick();
      toggleMenu();
    }
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo">
        <img src="./kepek_jegyzetek/MainLogo(png).png" alt="BuliHub Logo" />
      </div>

      {/* Hamburger ikon */}
      <div className={`hamburger ${isMenuOpen ? "active" : ""}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Menüpontok */}
      <ul className={`nav-links ${isMenuOpen ? "open" : ""}`}>
        <li>
          <a href="/" onClick={toggleMenu}>Főoldal</a>
        </li>
        <li>
          <a href="/events" onClick={toggleMenu}>Események</a>
        </li>
        <li>
          <a href="/contact" onClick={toggleMenu}>Kapcsolat</a>
        </li>
        <li>
          <a
            href="#"
            onClick={handleRegisterClick}
            className={user ? "disabled" : ""}
          >
            Regisztráció
          </a>
        </li>
      </ul>

      {/* Bejelentkezett felhasználó adatai */}
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
