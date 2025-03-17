import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Footer.css';

function Footer() {
  const navigate = useNavigate();

  const handleMainClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/");
  };

  const handleResultsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    // Navigáljunk a főoldalra, majd görgetünk a section2-re
    navigate("/");
    setTimeout(() => {
      const section2 = document.getElementById("section2");
      if (section2) {
        section2.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleContactClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    navigate("/contact");
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-column">
          <img
            src="./kepek_jegyzetek/MainLogo(png).png"
            alt="BuliHub Logo"
            className="footer-logo"
          />
          <p className="footer-description">
            A BuliHub összeköti a bulizni vágyókat és a szervezőket, hogy
            mindenki megtalálja a neki való eseményt.
          </p>
        </div>

        <div className="footer-column">
          <h3>Menü</h3>
          <ul className="footer-links">
            <li>
              <a href="/" onClick={handleMainClick}>Főoldal</a>
            </li>
            <li>
              <a href="/#section2" onClick={handleResultsClick}>Eredmények</a>
            </li>
            <li>
              <a href="/events">Események</a>
            </li>
            <li>
              <a href="/contact" onClick={handleContactClick}>Kapcsolat</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Elérhetőségek</h3>
          <p>Cím: 4032 Debrecen, Cívis utca 3.</p>
          <p>Telefon: +36 30 332 9083</p>
          <p>E-mail: info@bulihub.hu</p>
        </div>

        <div className="footer-column">
          <h3>Hírlevél</h3>
          <p>Iratkozz fel, hogy elsőként értesülj a legújabb bulikról!</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="E-mail címed"
              aria-label="E-mail címed"
              required
            />
            <button type="submit" className="btn newsletter-btn">
              Feliratkozom
            </button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} BuliHub. Minden jog fenntartva.
        </p>
        <div className="footer-socials">
          <a href="https://www.facebook.com/profile.php?id=61572704108154&sk=about" target="_blank" rel="noreferrer">
            <img src="./kepek_jegyzetek/face.png" alt="Facebook" />
          </a>
          <a href="https://www.instagram.com/bulihub/" target="_blank" rel="noreferrer">
            <img src="./kepek_jegyzetek/insta.png" alt="Instagram" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img src="./kepek_jegyzetek/X.png" alt="X" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
