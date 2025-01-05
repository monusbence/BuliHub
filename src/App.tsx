// App.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import './App.css';

const App: React.FC = () => {
  // 1. Splash Screen állapota
  const [showSplash, setShowSplash] = useState(true);

  // 2. A telefon forgatásához kapcsolódó progress
  const [progress, setProgress] = useState<number>(0);
  const [locked, setLocked] = useState<boolean>(true);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // Splash Screen 4 másodperces időzítéssel
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000); // 4s = annyit tart az animáció
    return () => clearTimeout(timer);
  }, []);

  // A forgatás ideje alatt tiltjuk a scroll-t
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [locked]);

  // Görgetés esemény a telefon forgatáshoz
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      if (!locked) return;
      e.preventDefault();
      const SCROLL_DISTANCE = 500;
      const delta = e.deltaY;
      const newProgress = progress + delta / SCROLL_DISTANCE;
      const clampedProgress = Math.max(0, Math.min(1, newProgress));
      setProgress(clampedProgress);

      if (clampedProgress >= 1) {
        setLocked(false);
      }
    },
    [locked, progress]
  );

  // A telefon forgatás szöge: -15°-ról 0°-ra
  const startAngle = -15;
  const endAngle = 0;
  const rotateAngle = startAngle + (endAngle - startAngle) * progress;

  // Hamburger menü
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Form state + űrlapkezelés
  const [formData, setFormData] = useState({
    partyName: '',
    date: '',
    time: '',
    location: '',
    guests: '',
    theme: '',
    description: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Buli adatok:', formData);
    setFormData({
      partyName: '',
      date: '',
      time: '',
      location: '',
      guests: '',
      theme: '',
      description: '',
    });
    alert('A buli sikeresen létrehozva!');
  };

  return (
    <>
      {/* SPLASH SCREEN (3 lüktetés, lassú fade in) */}
      {showSplash && (
        <div className="splash-screen">
          <img src="./AppLogo(png).png" alt="App Logo" className="splash-logo" />
        </div>
      )}

      {/* FŐ TARTALOM (csak akkor látható, ha a showSplash false) */}
      <div
        className={`app-container ${showSplash ? 'hidden' : ''}`}
        onWheel={handleWheel}
      >
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo">
            <img src="./MainLogo(png).png" alt="BuliHub Logo" />
          </div>
          <div
            className={`hamburger ${isMenuOpen ? 'active' : ''}`}
            onClick={toggleMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </div>

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

            {/* Telefon animáció */}
            <motion.div
              className="telokeret"
              animate={{ rotate: rotateAngle }}
              transition={{ type: 'tween', duration: 0.2 }}
            >
              <div className="top-bar">
                <div className="camera-notch">
                  <div className="speaker"></div>
                  <div className="camera-dot"></div>
                </div>
              </div>
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
              <div className="bottom-bar">
                <div className="home-indicator"></div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* SECTION 2 – 3 kártya */}
        <section id="section2">
          <div className="cards-container">
            <div className="card">
              <h2 className="gradient-number">+200</h2>
              <p>Meghirdetett esemény hetente</p>
            </div>
            <div className="card">
              <h2 className="gradient-number">+500</h2>
              <p>Ellenőrzött vélemény</p>
            </div>
            <div className="card">
              <h2 className="gradient-number">+1000</h2>
              <p>Eladott jegyek hetente</p>
            </div>
          </div>
        </section>

        {/* SECTION 3 – Bal oldalt form, jobb oldalt egy kép */}
        <section id="section3">
          <div className="section3-content">
            <div className="left-side">
              <h2>Hozz létre egy bulit!</h2>
              <p>Töltsd ki az alábbi űrlapot a buli részleteivel.</p>

              <form className="party-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="partyName">Buli neve</label>
                  <input
                    type="text"
                    id="partyName"
                    name="partyName"
                    placeholder="Add meg a buli nevét"
                    value={formData.partyName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="date">Dátum</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="time">Időpont</label>
                  <input
                    type="time"
                    id="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="location">Helyszín</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    placeholder="Add meg a helyszínt"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="guests">Vendégek száma</label>
                  <input
                    type="number"
                    id="guests"
                    name="guests"
                    min="1"
                    placeholder="Hány vendéget vársz?"
                    value={formData.guests}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="theme">Téma</label>
                  <select
                    id="theme"
                    name="theme"
                    value={formData.theme}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Válassz egy témát</option>
                    <option value="retro">Retro</option>
                    <option value="techno">Techno</option>
                    <option value="hiphop">Hip-Hop</option>
                    <option value="others">Egyéb</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="description">Leírás</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    placeholder="Írj egy rövid leírást a buliról..."
                    value={formData.description}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <button type="submit" className="btn submit-btn">
                  Buli létrehozása
                </button>
              </form>
            </div>

            <div className="right-side">
              <img
                src="src/telcsi.png"
                alt="party-pic"
                style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
              />
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default App;
