import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const App: React.FC = () => {
  // A telefon forgatásához kapcsolódó progress: 0 => -15 fok, 1 => 0 fok
  const [progress, setProgress] = useState<number>(0);
  // locked: true => letiltva a görgetés (eleinte nem lehet scrollozni)
  const [locked, setLocked] = useState<boolean>(true);
  // Hamburger menü nyitva/zárva
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Body görgetés tiltása/engedélyezése
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [locked]);

  // Görgetés kezelése - amíg locked, addig a görgetés forgatja a telefont
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!locked) return;

      e.preventDefault();

      const SCROLL_DISTANCE = 500; // görgetés érzékenysége
      const delta = e.deltaY;

      const newProgress = progress + delta / SCROLL_DISTANCE;
      const clampedProgress = Math.max(0, Math.min(1, newProgress));
      setProgress(clampedProgress);

      // Ha elérjük az 1.0 progress-t, oldjuk a scroll tiltását
      if (clampedProgress >= 1) {
        setLocked(false);
      }
    },
    [locked, progress]
  );

  // Telefon forgatása progress alapján
  // progress=0 => -15 fok, progress=1 => 0 fok
  const startAngle = -15;
  const endAngle = 0;
  const rotateAngle = startAngle + (endAngle - startAngle) * progress;

  // Hamburger menü toggle
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className="app-container" onWheel={handleWheel}>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">BuliHub</div>

        {/* Hamburger ikon – mobil nézetben */}
        <div
          className={`hamburger ${isMenuOpen ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* Menülista – asztali nézetben látható, mobilon hamburger */}
        <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <li>
            <a href="#section1" onClick={() => setIsMenuOpen(false)}>
              Szervezz Bulit
            </a>
          </li>
          <li>
            <a href="#section2" onClick={() => setIsMenuOpen(false)}>
              Események
            </a>
          </li>
          <li>
            <a href="#section3" onClick={() => setIsMenuOpen(false)}>
              Kapcsolat
            </a>
          </li>
          <li>
            <a href="#section3" onClick={() => setIsMenuOpen(false)}>
              Hitelesített szervező vagyok
            </a>
          </li>
        </ul>
      </nav>

      {/* SECTION 1 */}
      <section id="section1">
        <div className="section1-content">
          <div className="text">
            <h1>Üdvözöllek a BuliHub oldalán!</h1>
            <p>Hozd ki a maximumot minden éjszakából!</p>
          </div>

          {/* A telefon, amit framer-motion-nel forgatunk */}
          <motion.div
            className="telokeret"
            animate={{ rotate: rotateAngle }}
            transition={{ type: 'tween', duration: 0.2 }}
          >
            {/* Felső sáv (notch, kamera) */}
            <div className="top-bar">
              <div className="camera-notch">
                <div className="speaker"></div>
                <div className="camera-dot"></div>
              </div>
            </div>

            {/* A kijelző (login felület) */}
            <div className="phone-screen">
              <img src="./MainLogo(png).png" alt="logo" className="logo-img" />
              <h2 className="login-title">Bejelentkezés</h2>

              <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  placeholder="Add meg az e-mail címed"
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">Jelszó</label>
                <input
                  type="password"
                  id="password"
                  placeholder="Add meg a jelszavad"
                />
              </div>

              <button className="btn login-btn">Bejelentkezés</button>

              <a href="#" className="forgot-link">
                Elfelejtetted a jelszavad?
              </a>
              <a href="#" className="register-link">
                Regisztrálj új fiókot
              </a>
            </div>

            {/* Alsó sáv (home indicator) */}
            <div className="bottom-bar">
              <div className="home-indicator"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2 */}
      <section id="section2">
        <div className="cards-container">
          <div className="card">
            <h2>Neon Night</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
              risus eget lorem efficitur varius.
            </p>
          </div>
          <div className="card">
            <h2>Electro Vibes</h2>
            <p>
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
              posuere cubilia.
            </p>
          </div>
          <div className="card">
            <h2>Glow Party</h2>
            <p>
              Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie
              vehicula.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="section3">
        <h2>Lépj kapcsolatba velünk!</h2>
        <p>Írj nekünk üzenetet, ha bármilyen kérdésed van.</p>
      </section>
    </div>
  );
};

export default App;
