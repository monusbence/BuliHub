import React from 'react';
import './Footer.css'; // vagy App.css – attól függ, hova illeszted be a stílust

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      {/* Felső sáv - 4 oszlop */}
      <div className="footer-top">
        {/* 1. oszlop: Logo és rövid bemutatkozó szöveg */}
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

        {/* 2. oszlop: Gyors linkek / menüpontok */}
        <div className="footer-column">
          <h3>Menü</h3>
          <ul className="footer-links">
            <li>
              <a href="#section1">Főoldal</a>
            </li>
            <li>
              <a href="#section2">Eredmények</a>
            </li>
            <li>
              <a href="#section3">Kapcsolat</a>
            </li>
            <li>
              <a href="#hitelesites">Hitelesítés</a>
            </li>
          </ul>
        </div>

        {/* 3. oszlop: Elérhetőségek */}
        <div className="footer-column">
          <h3>Elérhetőségek</h3>
          <p>Cím: 1234 Budapest, Példa utca 56.</p>
          <p>Telefon: +36 1 234 5678</p>
          <p>E-mail: info@bulihub.hu</p>
        </div>

        {/* 4. oszlop: Hírlevél feliratkozás */}
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

      {/* Alsó sáv - jogi információk, social ikonok stb. */}
      <div className="footer-bottom">
        <p>
          &copy; {new Date().getFullYear()} BuliHub. Minden jog fenntartva.
        </p>
        <div className="footer-socials">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <img src="./kepek_jegyzetek/face.png" alt="Facebook" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <img src="./kepek_jegyzetek/insta.png" alt="Instagram" />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer">
            <img src="./kepek_jegyzetek/X.png" alt="X" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
