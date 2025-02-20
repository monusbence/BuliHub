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

  // Váltás a két regisztrációs űrlap között
  const [showCertifiedForm, setShowCertifiedForm] = useState<boolean>(false);
  const handleFormToggle = (isCertified: boolean) => {
    setShowCertifiedForm(isCertified);
  };

  // SIMA REGISZTRÁCIÓS ŰRLAP állapota
  const [basicFormData, setBasicFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    city: '',
    gender: '',
  });

  const handleBasicInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBasicFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (basicFormData.password !== basicFormData.confirmPassword) {
      alert('A két jelszó nem egyezik!');
      return;
    }
    const registerData = {
      FullName: basicFormData.fullName,
      Email: basicFormData.email,
      Password: basicFormData.password,
      BirthDate: basicFormData.birthDate,
      Gender: basicFormData.gender === 'ferfi',
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
    setBasicFormData({
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      city: '',
      gender: '',
    });
  };

  // HITELSZERVEZŐ REGISZTRÁCIÓS ŰRLAP állapota
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

  // BULI LÉTREHOZÓ ŰRLAP állapota
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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const eventData = {
      partyName: formData.partyName,
      date: formData.date,
      time: formData.time,
      location: formData.location,
      guests: parseInt(formData.guests),
      theme: formData.theme,
      description: formData.description,
    };
    try {
      const response = await fetch('https://localhost:7248/api/Events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      if (!response.ok) {
        const errorText = await response.text();
        alert('Hiba történt az esemény létrehozása során: ' + errorText);
      } else {
        alert('Esemény sikeresen létrehozva!');
      }
    } catch (error) {
      console.error('Hiba az esemény létrehozása során:', error);
      alert('Hiba történt az esemény létrehozása során');
    }
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

  // BEJELENTKEZÉS állapota
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [user, setUser] = useState<{ fullName: string } | null>(null);
  const [loginSuccessMessage, setLoginSuccessMessage] = useState<boolean>(false);
  const [loginSuccessName, setLoginSuccessName] = useState<string>('');
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const section2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [locked]);

  useEffect(() => {
    document.body.style.overflow = isCertifiedModalOpen ? 'hidden' : locked ? 'hidden' : 'auto';
  }, [isCertifiedModalOpen, locked]);

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const SCROLL_DISTANCE = 500;
      const delta = e.deltaY;
      if (locked) {
        e.preventDefault();
        const newProgress = progress + delta / SCROLL_DISTANCE;
        const clampedProgress = Math.max(0, Math.min(1, newProgress));
        setProgress(clampedProgress);
        if (clampedProgress >= 1) setLocked(false);
      } else {
        if (window.scrollY === 0 && delta < 0 && progress > 0) {
          e.preventDefault();
          const newProgress = progress + delta / SCROLL_DISTANCE;
          const clampedProgress = Math.max(0, Math.min(1, newProgress));
          setProgress(clampedProgress);
          if (clampedProgress <= 0) setLocked(true);
        }
      }
    },
    [locked, progress]
  );

  const startAngle = -15;
  const endAngle = 0;
  const rotateAngle = startAngle + (endAngle - startAngle) * progress;

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const openCertifiedModal = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsMenuOpen(false);
    setIsCertifiedModalOpen(true);
  };

  const closeCertifiedModal = () => setIsCertifiedModalOpen(false);

  const handleLogin = async () => {
    const loginData = { email: loginEmail, password: loginPassword };
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
        const data = await response.json();
        localStorage.setItem('jwtToken', data.token);
        localStorage.setItem('user', JSON.stringify({ fullName: data.name }));
        setUser({ fullName: data.name });
        setLoginSuccessName(data.name);
        setLoginSuccessMessage(true);
      }
    } catch (error) {
      console.error('Hiba a bejelentkezés során:', error);
      alert('Hiba történt a bejelentkezés során');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  };

  return (
    <>
      {showSplash && (
        <div className="splash-screen">
          <img src="./kepek_jegyzetek/AppLogo(png).png" alt="App Logo" className="splash-logo" />
        </div>
      )}

      <div className={`app-container ${showSplash ? 'hidden' : ''}`} onWheel={handleWheel}>
        <nav className="navbar">
          <div className="logo">
            <img src="./kepek_jegyzetek/MainLogo(png).png" alt="BuliHub Logo" />
          </div>
          <div className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <li>
              <a href="#section1" onClick={() => setIsMenuOpen(false)}>Főoldal</a>
            </li>
            <li>
              <a href="/events" onClick={() => setIsMenuOpen(false)}>Események</a>
            </li>
            <li>
              <a href="/contact" onClick={() => setIsMenuOpen(false)}>Kapcsolat</a>
            </li>
            <li>
              <a href="#" onClick={openCertifiedModal}>Regisztráció</a>
            </li>
          </ul>
          {user && (
            <div className="user-info">
              <span>{user.fullName}</span>
              <button className="logout-btn" onClick={handleLogout}>Kijelentkezés</button>
            </div>
          )}
        </nav>

        <section id="section1">
          <div className="section1-content">
            <div className="text">
              <h1>Üdvözöllek a BuliHub oldalán!</h1>
              <div className="store-buttons">
                <img src="./src/google-play.png" alt="Google Play" className="store-icon" />
                <img src="./src/app-storee.png" alt="App Store" className="store-icon" />
              </div>
            </div>
            <motion.div className="telokeret" animate={{ rotate: rotateAngle }} transition={{ type: 'tween', duration: 0.2 }}>
              <div className="top-bar">
                <div className="camera-notch">
                  <div className="speaker"></div>
                  <div className="camera-dot"></div>
                </div>
              </div>
              <div className="phone-screen">
                <img src="./kepek_jegyzetek/MainLogo(png).png" alt="logo" className="logo-img" />
                <h2 className="login-title">Bejelentkezés</h2>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input type="email" id="email" placeholder="Add meg az e-mail címed" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                </div>
                <div className="input-group">
                  <label htmlFor="password">Jelszó</label>
                  <input type="password" id="password" placeholder="Add meg a jelszavad" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
                </div>
                <button className="btn login-btn" onClick={handleLogin}>Bejelentkezés</button>
                <a href="#" className="forgot-link">Elfelejtetted a jelszavad?</a>
                <a href="#" className="register-link" onClick={(e) => { e.preventDefault(); openCertifiedModal(e); }}>
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
          <div className="cards-container" style={{ position: 'relative', height: '350px', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <motion.div className="card left-card" variants={leftCardVariants} initial="initial" animate={cardsExpanded ? 'animate' : 'initial'} exit="exit" style={{ position: 'absolute', left: 'calc(50% - 150px)', zIndex: 1 }}>
              <h2 className="gradient-number">+200</h2>
              <p>Meghirdetett esemény hetente</p>
            </motion.div>
            <motion.div className="card center-card" variants={centerCardVariants} initial="initial" animate="animate" style={{ position: 'absolute', left: 'calc(50% - 150px)', zIndex: 2 }}>
              <h2 className="gradient-number">+500</h2>
              <p>Ellenőrzött vélemény</p>
            </motion.div>
            <motion.div className="card right-card" variants={rightCardVariants} initial="initial" animate={cardsExpanded ? 'animate' : 'initial'} exit="exit" style={{ position: 'absolute', left: 'calc(50% - 150px)', zIndex: 1 }}>
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
              {user ? (
                <form className="party-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="partyName">Buli neve</label>
                    <input type="text" id="partyName" name="partyName" placeholder="Add meg a buli nevét" value={formData.partyName} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="date">Dátum</label>
                    <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="time">Időpont</label>
                    <input type="time" id="time" name="time" value={formData.time} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="location">Helyszín</label>
                    <input type="text" id="location" name="location" placeholder="Add meg a helyszínt" value={formData.location} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="guests">Vendégek száma</label>
                    <input type="number" id="guests" name="guests" min="1" placeholder="Hány vendéget vársz?" value={formData.guests} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="theme">Téma</label>
                    <select id="theme" name="theme" value={formData.theme} onChange={handleInputChange} required>
                      <option value="">Válassz egy témát</option>
                      <option value="retro">Retro</option>
                      <option value="techno">Techno</option>
                      <option value="hiphop">Hip-Hop</option>
                      <option value="others">Egyéb</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Leírás</label>
                    <textarea id="description" name="description" rows={4} placeholder="Írj egy rövid leírást a buliról..." value={formData.description} onChange={handleInputChange}></textarea>
                  </div>
                  <button type="submit" className="btn submit-btn">Buli létrehozása</button>
                </form>
              ) : (
                <p style={{ marginTop: '20px', fontStyle: 'italic', color: '#555' }}>
                  Jelentkezz be, hogy létrehozhass egy bulit!
                </p>
              )}
            </div>
            <div className="right-side">
              <img src="src/telcsi.png" alt="party-pic" style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} />
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
              initial={{ opacity: 0, scale: 0.75, boxShadow: '0 0 0px 0px rgba(200,65,198,0)' }}
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
                transition: { duration: 1, repeatType: 'reverse', ease: 'easeInOut' },
              }}
              exit={{ opacity: 0, scale: 0.75, boxShadow: '0 0 0px 0px rgba(200,65,198,0)' }}
            >
              <div className="modal-header">
                <h2>{showCertifiedForm ? 'Hitelesített Szervezői Regisztráció' : 'Regisztráció'}</h2>
                <button className="close-btn" onClick={closeCertifiedModal}>
                  &times;
                </button>
              </div>
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
              {!showCertifiedForm && (
                <form onSubmit={handleBasicSubmit} className="certified-form">
                  {/* Ide jönnének a basic regisztrációs mezők */}
                </form>
              )}
              {showCertifiedForm && (
                <form className="certified-form" onSubmit={handleCertifiedSubmit}>
                  {/* Ide jönnének a hitelesített regisztrációs mezők */}
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

      <AnimatePresence>
        {loginSuccessMessage && (
          <motion.div
            className="login-success-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="login-success-modal"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.7 }}
            >
              <h2 style={{ marginBottom: '1rem' }}>
                Helló, <span style={{ color: '#c841c6' }}>{loginSuccessName}</span>!
              </h2>
              <p style={{ marginBottom: '1rem' }}>Sikeresen bejelentkeztél a BuliHub-ra.</p>
              <button
                onClick={() => setLoginSuccessMessage(false)}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#c841c6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                OK
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </>
  );
}

export default App;
