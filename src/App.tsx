import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/footer'; // vagy ahogy az útvonalad alakul
import './App.css';

const App: React.FC = () => {
  // SPLASH SCREEN ÁLLAPOT
  const [showSplash, setShowSplash] = useState(true);

  // TELEFON FORGATÁS ÁLLAPOTOK
  const [progress, setProgress] = useState<number>(0);
  const [locked, setLocked] = useState<boolean>(true);

  // NAVBAR/HAMBURGER MENÜ
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // FELUGRÓ ABLAK (MODAL) ÁLLAPOT
  const [isCertifiedModalOpen, setIsCertifiedModalOpen] = useState<boolean>(false);

  // HITELSZERVEZŐ FORM STATE
  const [certifiedFormData, setCertifiedFormData] = useState({
    organizerName: '',
    companyName: '',
    taxNumber: '',
    companyRegisterNumber: '',
    phoneNumber: '',
    email: '',
    address: '',
    website: '',
    shortDescription: '',
    bankAccount: '',
    idDocument: null as File | null,
  });

  // Buli létrehozó FORM STATE
  const [formData, setFormData] = useState({
    partyName: '',
    date: '',
    time: '',
    location: '',
    guests: '',
    theme: '',
    description: '',
  });

  // SPLASH SCREEN IDŐZÍTÉS (4 mp)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // BODY SCROLL TILTÁSA (telefon forgatás) – Ha locked, ne lehessen görgetni
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [locked]);

  // BODY SCROLL TILTÁSA A MODAL NYITÁSÁNÁL (opcionális plusz)
  useEffect(() => {
    if (isCertifiedModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      // Ha lezárás, visszaállítjuk
      document.body.style.overflow = locked ? 'hidden' : 'auto';
    }
  }, [isCertifiedModalOpen, locked]);

  // GÖRGETÉS KEZELÉSE (Telefon forgatás)
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const SCROLL_DISTANCE = 500;
      const delta = e.deltaY;

      if (locked) {
        // Előreforgatás 0 -> 1
        e.preventDefault();
        const newProgress = progress + delta / SCROLL_DISTANCE;
        const clampedProgress = Math.max(0, Math.min(1, newProgress));
        setProgress(clampedProgress);

        if (clampedProgress >= 1) {
          setLocked(false);
        }
      } else {
        // Visszaforgatás 1 -> 0 (ha a lap tetején vagyunk és felfelé görgetünk)
        if (window.scrollY === 0 && delta < 0 && progress > 0) {
          e.preventDefault();
          const newProgress = progress + delta / SCROLL_DISTANCE;
          const clampedProgress = Math.max(0, Math.min(1, newProgress));
          setProgress(clampedProgress);

          if (clampedProgress <= 0) {
            setLocked(true);
          }
        }
      }
    },
    [locked, progress]
  );

  // TELEFON FORGÁS SZÖGE
  const startAngle = -15;
  const endAngle = 0;
  const rotateAngle = startAngle + (endAngle - startAngle) * progress;

  // HAMBURGER MENÜ
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  // MODAL NYITÁS / ZÁRÁS
  const openCertifiedModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); 
    setIsMenuOpen(false);
    setIsCertifiedModalOpen(true);
  };
  const closeCertifiedModal = () => setIsCertifiedModalOpen(false);

  // Buli létrehozó form kezelése
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
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
    alert('A buli sikeresen létrehozva!');
    setFormData({
      partyName: '',
      date: '',
      time: '',
      location: '',
      guests: '',
      theme: '',
      description: '',
    });
  };

  // HITELSZERVEZŐ (CERTIFIED) FORM KEZELÉSE
  const handleCertifiedInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCertifiedFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCertifiedFormData((prev) => ({
        ...prev,
        idDocument: e.target.files![0],
      }));
    }
  };

  const handleCertifiedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Hitelesített adatok:', certifiedFormData);
    alert('Köszönjük! A hitelesítés folyamatban van.');
    // Itt jöhetne pl. egy fetch/axios POST a backend felé...

    // Clear fields + modal close
    setCertifiedFormData({
      organizerName: '',
      companyName: '',
      taxNumber: '',
      companyRegisterNumber: '',
      phoneNumber: '',
      email: '',
      address: '',
      website: '',
      shortDescription: '',
      bankAccount: '',
      idDocument: null,
    });
    setIsCertifiedModalOpen(false);
  };

  return (
    <>
      {/* SPLASH SCREEN */}
      {showSplash && (
        <div className="splash-screen">
          <img
            src="./kepek_jegyzetek/AppLogo(png).png"
            alt="App Logo"
            className="splash-logo"
          />
        </div>
      )}

      {/* FŐ TARTALOM */}
      <div
        className={`app-container ${showSplash ? 'hidden' : ''}`}
        onWheel={handleWheel}
      >
        {/* NAVBAR */}
        <nav className="navbar">
          <div className="logo">
            <img
              src="./kepek_jegyzetek/MainLogo(png).png"
              alt="BuliHub Logo"
            />
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
                Főoldal
              </a>
            </li>
            <li>
              <a href="EventsPage.tsx" onClick={() => setIsMenuOpen(false)}>
                Események
              </a>
            </li>
            <li>
              <a href="#section3" onClick={() => setIsMenuOpen(false)}>
                Kapcsolat
              </a>
            </li>
            <li>
              <a href="#" onClick={openCertifiedModal}>
                Hitelesített szervezői regisztráció
              </a>
            </li>
          </ul>
        </nav>

        {/* SECTION 1 */}
        <section id="section1">
          <div className="section1-content">
            <div className="text">
              <h1>Üdvözöllek a BuliHub oldalán!</h1>
              <div className="store-buttons">
                <img
                  src="./src/google-play.png"
                  alt="Google Play"
                  className="store-icon"
                />
                <img
                  src="./src/app-storee.png"
                  alt="App Store"
                  className="store-icon"
                />
              </div>
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
                <img
                  src="./kepek_jegyzetek/MainLogo(png).png"
                  alt="logo"
                  className="logo-img"
                />
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

                <a
                  href="/register"
                  className="register-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Regisztrálj új fiókot
                </a>
              </div>
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

        {/* SECTION 3 */}
        <section id="section3">
          <div className="section3-content">
            {/* Bal oldal - Buli létrehozása */}
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

            {/* Jobb oldal - kép */}
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

      {/* MODAL (Hitelesített Szervezői Regisztráció) */}
      <AnimatePresence>
        {isCertifiedModalOpen && (
          <div className="modal-wrapper">
            {/* Háttér (overlay) */}
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* RAGYOGÓ, PULZÁLÓ KERET A MODALON */}
            <motion.div
  className="modal-container"
  initial={{
    opacity: 0,
    scale: 0.75,
    // 0-ról induló fény
    boxShadow: '0 0 0px 0px rgba(200, 65, 198, 0)',
  }}
  animate={{
    opacity: 1,
    scale: 1,
    // Ráérősebb, sokkal gyengébb pulzálás
    boxShadow: [
      '0 0 0px 0px rgba(200, 65, 198, 0)',      // indul 0-ról
      '0 0 6px 3px rgba(200, 65, 198, 0.2)',    // enyhén megnő
      '0 0 10px 5px rgba(200, 65, 198, 0.3)',   // kicsit erősebb, de még visszafogott
      '0 0 6px 3px rgba(200, 65, 198, 0.2)',    // visszaleng
      '0 0 0px 0px rgba(200, 65, 198, 0)',      // visszatér 0-ra
    ],
    transition: {
      duration: 1,         // Lassú, 4 mp-es kör
   // Végtelen ismétlés
      repeatType: 'reverse',
      ease: 'easeInOut',
    },
  }}
  exit={{
    opacity: 0,
    scale: 0.75,
    boxShadow: '0 0 0px 0px rgba(200, 65, 198, 0)',
  }}
>
              <div className="modal-header">
                <h2>Hitelesített Szervezői Regisztráció</h2>
                <button className="close-btn" onClick={closeCertifiedModal}>
                  &times;
                </button>
              </div>

              <form className="certified-form" onSubmit={handleCertifiedSubmit}>
                <div className="form-group">
                  <label htmlFor="organizerName">Szervező neve</label>
                  <input
                    type="text"
                    id="organizerName"
                    name="organizerName"
                    placeholder="Teljes név"
                    value={certifiedFormData.organizerName}
                    onChange={handleCertifiedInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyName">Cég / Egyesület / Alapítvány</label>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    placeholder="Cég neve"
                    value={certifiedFormData.companyName}
                    onChange={handleCertifiedInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="taxNumber">Adószám</label>
                  <input
                    type="text"
                    id="taxNumber"
                    name="taxNumber"
                    placeholder="Adószám (ha van)"
                    value={certifiedFormData.taxNumber}
                    onChange={handleCertifiedInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="companyRegisterNumber">Cégjegyzékszám</label>
                  <input
                    type="text"
                    id="companyRegisterNumber"
                    name="companyRegisterNumber"
                    placeholder="12-34-567890"
                    value={certifiedFormData.companyRegisterNumber}
                    onChange={handleCertifiedInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">Telefonszám</label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="+36..."
                    value={certifiedFormData.phoneNumber}
                    onChange={handleCertifiedInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="E-mail cím"
                    value={certifiedFormData.email}
                    onChange={handleCertifiedInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">Székhely / Lakcím</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="Irányítószám, Város, Utca, Házszám"
                    value={certifiedFormData.address}
                    onChange={handleCertifiedInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="website">Weboldal (ha van)</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    placeholder="https://"
                    value={certifiedFormData.website}
                    onChange={handleCertifiedInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="shortDescription">Rövid leírás (max. 500 karakter)</label>
                  <textarea
                    id="shortDescription"
                    name="shortDescription"
                    rows={3}
                    maxLength={500}
                    placeholder="Mesélj röviden a tevékenységedről..."
                    value={certifiedFormData.shortDescription}
                    onChange={handleCertifiedInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="bankAccount">Bankszámlaszám (opcionális)</label>
                  <input
                    type="text"
                    id="bankAccount"
                    name="bankAccount"
                    placeholder="12345678-12345678-00000000"
                    value={certifiedFormData.bankAccount}
                    onChange={handleCertifiedInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="idDocument">Igazolvány / Dokumentum (PDF/JPG)</label>
                  <input
                    type="file"
                    id="idDocument"
                    name="idDocument"
                    accept="application/pdf, image/*"
                    onChange={handleFileChange}
                  />
                </div>

                {/* Lebegő/pulzáló animáció a Küldés gombon HOVER-kor */}
                <motion.button
                  type="submit"
                  className="btn submit-btn"
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 0 10px 4px rgba(168, 53, 162, 0.6)',
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  Küldés
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default App;
