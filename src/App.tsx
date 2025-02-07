import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './components/footer';
import './App.css';

// Framer Motion variánsok a Section2 kártyáihoz
const leftCardVariants = {
  initial: { x: 0, opacity: 0 },
  animate: { x: -350, opacity: 1, transition: { duration: 1 } },
  exit: { x: 0, opacity: 0, transition: { duration: 1 } },
};

const rightCardVariants = {
  initial: { x: 0, opacity: 0 },
  animate: { x: 350, opacity: 1, transition: { duration: 1 } },
  exit: { x: 0, opacity: 0, transition: { duration: 1 } },
};

const centerCardVariants = {
  initial: { x: 0, opacity: 1 },
  animate: { x: 0, opacity: 1 },
};

function App() {
  // SPLASH SCREEN ÁLLAPOT
  const [showSplash, setShowSplash] = useState(true);

  // TELEFON FORGATÁS ÁLLAPOTOK
  const [progress, setProgress] = useState<number>(0);
  const [locked, setLocked] = useState<boolean>(true);

  // NAVBAR/HAMBURGER MENÜ
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  // MODAL (Hitelesített szervezői regisztráció)
  const [isCertifiedModalOpen, setIsCertifiedModalOpen] = useState<boolean>(false);

  // ─────────────────────────────────────────────────────────────
  // ÚJ: Váltás a modalban a „Sima regisztráció” és 
  // a „Hitelesített szervezői regisztráció” között
  // ─────────────────────────────────────────────────────────────
  const [showCertifiedForm, setShowCertifiedForm] = useState<boolean>(false);
  const handleFormToggle = (isCertified: boolean) => {
    setShowCertifiedForm(isCertified);
  };

  // ─────────────────────────────────────────────────────────────
  // 1) SIMA REGISZTRÁCIÓS ŰRLAP (Backend integráció)
  // ─────────────────────────────────────────────────────────────
  const [basicFormData, setBasicFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    city: '',
    gender: '',
  });

  const handleBasicInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBasicFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Jelszó egyezés ellenőrzés
    if (basicFormData.password !== basicFormData.confirmPassword) {
      alert('A két jelszó nem egyezik!');
      return;
    }

    // A backend által elvárt regisztrációs adatok összeállítása
    const registerData = {
      FullName: basicFormData.fullName,
      Email: basicFormData.email,
      Password: basicFormData.password,
      BirthDate: basicFormData.birthDate,
      Gender: basicFormData.gender === 'ferfi', // Ha 'ferfi', akkor true, egyébként false
      City: basicFormData.city,
    };

    try {
      const response = await fetch('https://localhost:7248/api/Auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Regisztráció sikertelen: ' + JSON.stringify(errorData));
      } else {
        alert('Sikeres regisztráció!');
      }
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      alert('Hiba történt a regisztráció során');
    }

    // Ha minden oké, ürítsük ki a formot:
    setBasicFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      city: '',
      gender: '',
    });
    // És ha szeretnénk, itt zárhatjuk be a modalt is:
    // setIsCertifiedModalOpen(false);
  };

  // ─────────────────────────────────────────────────────────────
  // 2) HITELSZERVEZŐ (hitelesített) REGISZTRÁCIÓS ŰRLAP (Backend integráció)
  // ─────────────────────────────────────────────────────────────
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

  const handleCertifiedInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCertifiedFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertifiedFormData((prev) => ({
        ...prev,
        idDocument: file,
      }));
    }
  };

  const handleCertifiedSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // A backend által elvárt regisztrációs adatok (hitelesített)
    const registerData = {
      OrganizerName: certifiedFormData.organizerName,
      CompanyName: certifiedFormData.companyName,
      TaxNumber: certifiedFormData.taxNumber,
      CompanyRegisterNumber: certifiedFormData.companyRegisterNumber,
      PhoneNumber: certifiedFormData.phoneNumber,
      Email: certifiedFormData.email,
      Address: certifiedFormData.address,
      Website: certifiedFormData.website,
      ShortDescription: certifiedFormData.shortDescription,
      BankAccount: certifiedFormData.bankAccount,
      // Fájlt külön (multipart) kellene küldeni, ha a backend úgy várja,
      // itt most egyszerűségként JSON-be tesszük, ha a backend is így kezeli.
    };

    try {
      const response = await fetch('https://localhost:7248/api/Auth/registercertified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Regisztráció sikertelen: ' + JSON.stringify(errorData));
      } else {
        alert('Köszönjük! A hitelesítés folyamatban van.');
      }
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      alert('Hiba történt a regisztráció során');
    }

    // Reset és modal bezárás
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

  // PARTI LÉTREHOZÓ FORM
  const [formData, setFormData] = useState({
    partyName: '',
    date: '',
    time: '',
    location: '',
    guests: '',
    theme: '',
    description: '',
  });

  // STATE a bejelentkezéshez
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // SECTION2 kártyák állapota
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const section2Ref = useRef<HTMLDivElement>(null);

  // SPLASH SCREEN IDŐZÍTÉS (4 mp)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  // BODY SCROLL TILTÁSA (ha locked)
  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [locked]);

  // MODAL NYITÁSÁNÁL is tiltjuk a scrollt
  useEffect(() => {
    if (isCertifiedModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = locked ? 'hidden' : 'auto';
    }
  }, [isCertifiedModalOpen, locked]);

  // GÖRGETÉS KEZELÉSE (telefon forgatás)
  const handleWheel = useCallback((e: React.WheelEvent) => {
    const SCROLL_DISTANCE = 500;
    const delta = e.deltaY;

    if (locked) {
      e.preventDefault();
      const newProgress = progress + delta / SCROLL_DISTANCE;
      const clampedProgress = Math.max(0, Math.min(1, newProgress));
      setProgress(clampedProgress);
      if (clampedProgress >= 1) {
        setLocked(false);
      }
    } else {
      // Ha tetején vagyunk és "felfelé görgetünk":
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
  }, [locked, progress]);

  // TELEFON FORGATÁS SZÖG
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
    // Alaphelyzetben pl. a hitelesített űrlapra is ugorhatnánk,
    // de maradhat a sima is:
    // setShowCertifiedForm(true);
  };
  const closeCertifiedModal = () => setIsCertifiedModalOpen(false);

  // BULI LÉTREHOZÓ FORM KEZELÉSE
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

  // SECTION2 megfigyelése (Intersection Observer)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!cardsExpanded) {
              setCardsExpanded(true);
            }
          } else {
            if (cardsExpanded) {
              setCardsExpanded(false);
            }
          }
        });
      },
      { threshold: 0.5 }
    );
    if (section2Ref.current) {
      observer.observe(section2Ref.current);
    }
    return () => {
      if (section2Ref.current) {
        observer.unobserve(section2Ref.current);
      }
    };
  }, [cardsExpanded]);

  // BEJELENTKEZÉS HANDLER
  const handleLogin = async () => {
    const loginData = {
      email: loginEmail,
      password: loginPassword,
    };

    try {
      const response = await fetch('https://localhost:7248/api/Auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert('Bejelentkezés sikertelen: ' + errorText);
      } else {
        alert('Bejelentkezés sikeres!');
      }
    } catch (error) {
      console.error('Hiba a bejelentkezés során:', error);
      alert('Hiba történt a bejelentkezés során');
    }
  };

  return (
    <>
      {showSplash && (
        <div className="splash-screen">
          <img
            src="./kepek_jegyzetek/AppLogo(png).png"
            alt="App Logo"
            className="splash-logo"
          />
        </div>
      )}

      <div
        className={`app-container ${showSplash ? 'hidden' : ''}`}
        onWheel={handleWheel}
      >
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
              <a href="/events" onClick={() => setIsMenuOpen(false)}>
                Események
              </a>
            </li>
            <li>
              <a href="/contact" onClick={() => setIsMenuOpen(false)}>
                Kapcsolat
              </a>
            </li>
            <li>
              <a href="#" onClick={openCertifiedModal}>
                Regisztráció
              </a>
            </li>
          </ul>
        </nav>

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
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Jelszó</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Add meg a jelszavad"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                </div>
                <button
                  className="btn login-btn"
                  onClick={handleLogin}
                >
                  Bejelentkezés
                </button>
                <a href="#" className="forgot-link">
                  Elfelejtetted a jelszavad?
                </a>
                {/* Ha erre kattint a felhasználó, ugyanazt a modalt nyitjuk, mint a navbarban */}
                <a
                  href="#"
                  className="register-link"
                  onClick={(e) => {
                    e.preventDefault();
                    openCertifiedModal(e);
                  }}
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

        <section id="section2" ref={section2Ref}>
          <div
            className="cards-container"
            style={{
              position: 'relative',
              height: '350px',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <motion.div
              className="card left-card"
              variants={leftCardVariants}
              initial="initial"
              animate={cardsExpanded ? 'animate' : 'initial'}
              exit="exit"
              style={{
                position: 'absolute',
                left: 'calc(50% - 150px)',
                zIndex: 1,
              }}
            >
              <h2 className="gradient-number">+200</h2>
              <p>Meghirdetett esemény hetente</p>
            </motion.div>
            <motion.div
              className="card center-card"
              variants={centerCardVariants}
              initial="initial"
              animate="animate"
              style={{
                position: 'absolute',
                left: 'calc(50% - 150px)',
                zIndex: 2,
              }}
            >
              <h2 className="gradient-number">+500</h2>
              <p>Ellenőrzött vélemény</p>
            </motion.div>
            <motion.div
              className="card right-card"
              variants={rightCardVariants}
              initial="initial"
              animate={cardsExpanded ? 'animate' : 'initial'}
              exit="exit"
              style={{
                position: 'absolute',
                left: 'calc(50% - 150px)',
                zIndex: 1,
              }}
            >
              <h2 className="gradient-number">+1000</h2>
              <p>Eladott jegyek hetente</p>
            </motion.div>
          </div>
        </section>

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

      <AnimatePresence>
        {isCertifiedModalOpen && (
          <div className="modal-wrapper">
            <motion.div
              className="modal-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.div
              className="modal-container"
              initial={{
                opacity: 0,
                scale: 0.75,
                boxShadow: '0 0 0px 0px rgba(200,65,198,0)',
              }}
              animate={{
                opacity: 1,
                scale: 1,
                boxShadow: [
                  '0 0 0px 0px rgba(200,65,198,0)',
                  '0 0 6px 3px rgba(200,65,198,0.2)',
                  '0 0 10px 5px rgba(200,65,198,0.3)',
                  '0 0 6px 3px rgba(200,65,198,0.2)',
                  '0 0 0px 0px rgba(200,65,198,0)',
                ],
                transition: {
                  duration: 1,
                  repeatType: 'reverse',
                  ease: 'easeInOut',
                },
              }}
              exit={{
                opacity: 0,
                scale: 0.75,
                boxShadow: '0 0 0px 0px rgba(200,65,198,0)',
              }}
            >
              <div className="modal-header">
                <h2>
                  {showCertifiedForm
                    ? 'Hitelesített Szervezői Regisztráció'
                    : 'Regisztráció'}
                </h2>
                <button className="close-btn" onClick={closeCertifiedModal}>
                  &times;
                </button>
              </div>

              {/* Gombok a két űrlap közötti váltáshoz */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                <button
                  onClick={() => handleFormToggle(false)}
                  style={{
                    backgroundColor: !showCertifiedForm ? '#c841c6' : '#ddd',
                    color: !showCertifiedForm ? '#fff' : '#000',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    border: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Sima regisztráció
                </button>
                <button
                  onClick={() => handleFormToggle(true)}
                  style={{
                    backgroundColor: showCertifiedForm ? '#c841c6' : '#ddd',
                    color: showCertifiedForm ? '#fff' : '#000',
                    padding: '8px 16px',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    border: 'none',
                    fontWeight: 'bold',
                  }}
                >
                  Hitelesített regisztráció
                </button>
              </div>

              {/* 1) SIMA REGISZTRÁCIÓS ŰRLAP (backendhez kötve) */}
              {!showCertifiedForm && (
                <form 
                  onSubmit={handleBasicSubmit} 
                  className="certified-form"
                >
                  <div className="form-group">
                    <label htmlFor="fullName">Teljes név</label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Add meg a neved"
                      value={basicFormData.fullName}
                      onChange={handleBasicInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="email@example.com"
                      value={basicFormData.email}
                      onChange={handleBasicInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="password">Jelszó</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      placeholder="******"
                      value={basicFormData.password}
                      onChange={handleBasicInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="confirmPassword">Jelszó megerősítése</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      placeholder="******"
                      value={basicFormData.confirmPassword}
                      onChange={handleBasicInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="birthDate">Születési dátum</label>
                    <input
                      type="date"
                      id="birthDate"
                      name="birthDate"
                      value={basicFormData.birthDate}
                      onChange={handleBasicInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="city">Város</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      placeholder="Pl.: Budapest"
                      value={basicFormData.city}
                      onChange={handleBasicInputChange}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gender">Nem</label>
                    <select
                      id="gender"
                      name="gender"
                      value={basicFormData.gender}
                      onChange={handleBasicInputChange}
                      required
                    >
                      <option value="">Válassz nemet</option>
                      <option value="ferfi">Férfi</option>
                      <option value="no">Nő</option>
                      <option value="egyeb">Egyéb</option>
                    </select>
                  </div>
                  <motion.button
                    type="submit"
                    className="btn submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Regisztráció
                  </motion.button>
                </form>
              )}

              {/* 2) HITELSZERVEZŐI (HITELESÍTETT) ŰRLAP (backendhez kötve) */}
              {showCertifiedForm && (
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
                    <label htmlFor="companyName">
                      Cég / Egyesület / Alapítvány
                    </label>
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
                    <label htmlFor="companyRegisterNumber">
                      Cégjegyzékszám
                    </label>
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
                    <label htmlFor="shortDescription">
                      Rövid leírás (max. 500 karakter)
                    </label>
                    <textarea
                      id="shortDescription"
                      name="shortDescription"
                      rows={3}
                      maxLength={500}
                      placeholder="Mesélj röviden a tevékenységedről..."
                      value={certifiedFormData.shortDescription}
                      onChange={handleCertifiedInputChange}
                    ></textarea>
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
                    <label htmlFor="idDocument">
                      Igazolvány / Dokumentum (PDF/JPG)
                    </label>
                    <input
                      type="file"
                      id="idDocument"
                      name="idDocument"
                      accept="application/pdf, image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <motion.button
                    type="submit"
                    className="btn submit-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Küldés
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;
