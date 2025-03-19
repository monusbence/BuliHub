import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/navbar';
import Footer from './components/footer';
import SplashScreen from './components/SplashScreen';
import HeroSection from './components/HeroSection';
import StatisticsSection from './components/StatisticsSection';
import CreateEventForm from './components/CreateEventForm';
import RegisterModal from './components/RegisterModal';
import ForgotPasswordModal from './components/ForgotPasswordModal';
import './App.css';

function App() {
  // Splash screen állapot
  const [showSplash, setShowSplash] = useState(true);

  // Felhasználó
  const [user, setUser] = useState<{ fullName: string } | null>(null);

  // Bejelentkezési mezők
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sikeres bejelentkezés overlay
  const [loginSuccessMessage, setLoginSuccessMessage] = useState(false);
  const [loginSuccessName, setLoginSuccessName] = useState('');

  // Regisztrációs modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Elfelejtett jelszó modal
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);

  // Telefongörgetés állapot (progress és locked)
  const [locked, setLocked] = useState(true);
  const [progress, setProgress] = useState(0);

  // Splash screen eltüntetése 4 mp után
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // User adatok betöltése a localStorage-ból
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Amíg a telefon nincs feloldva (locked), letiltjuk az oldal görgetését
  useEffect(() => {
    if (locked) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [locked]);

  // Görgetés kezelés: a telefon forgatása a progress alapján
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      const SCROLL_DISTANCE = 500; // görgetési érzékenység
      const delta = e.deltaY;

      if (locked) {
        // Ha a telefon még "zárva" van, letiltjuk a sima scroll-t,
        // és a progress alapján forgatjuk a telefont
        e.preventDefault();
        const newProgress = progress + delta / SCROLL_DISTANCE;
        const clampedProgress = Math.max(0, Math.min(1, newProgress));
        setProgress(clampedProgress);
        if (clampedProgress >= 1) setLocked(false); // feloldás, ha a progress eléri az 1-et
      } else {
        // Ha a telefon már fel van oldva:
        // visszagördülés esetén, ha a scroll tetején vagyunk, újra zárhatjuk
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

  // A telefon forgatása -15°-tól 0°-ig a progress alapján
  const rotateAngle = -15 + (0 - -15) * progress;

  // Bejelentkezés
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

  // Kijelentkezés
  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
  };

  return (
    <>
      {/* Splash Screen */}
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>

      {/* Főkonténer */}
      <div
        className={`app-container ${showSplash ? 'hidden' : ''}`}
        onWheel={handleWheel}
      >
        {/* Navbar */}
        <Navbar
          user={user}
          onLogout={handleLogout}
          onRegisterClick={() => setIsRegisterModalOpen(true)}
          isMenuOpen={false}
          toggleMenu={() => null}
        />

        {/* Hero Section - itt történik a forgó telefon animációja */}
        <HeroSection
          rotateAngle={rotateAngle}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          handleLogin={handleLogin}
          onRegisterClick={() => setIsRegisterModalOpen(true)}
          onForgotPasswordClick={() => setIsForgotPasswordModalOpen(true)}
          user={user}
        />


        {/* Statisztikák */}
        <StatisticsSection />

        {/* Esemény létrehozása */}
        {user ? (
          <CreateEventForm user={user} />
        ) : (
          <div style={{ textAlign: 'center', margin: '2rem 0' }}>
            <h2>Új buli létrehozása csak bejelentkezett felhasználóknak!</h2>
            <p>Kérjük, jelentkezz be, vagy regisztrálj.</p>
          </div>
        )}

        {/* Lábléc */}
        {!showSplash && <Footer />}
      </div>

      {/* Regisztrációs modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <RegisterModal onClose={() => setIsRegisterModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Elfelejtett jelszó modal */}
      <AnimatePresence>
        {isForgotPasswordModalOpen && (
          <ForgotPasswordModal onClose={() => setIsForgotPasswordModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sikeres bejelentkezés overlay */}
      <AnimatePresence>
        {loginSuccessMessage && (
          <div className="login-success-overlay">
            <div className="login-success-modal">
              <h2 style={{ marginBottom: '1rem' }}>
                Helló, <span style={{ color: '#c841c6' }}>{loginSuccessName}</span>!
              </h2>
              <p style={{ marginBottom: '1rem' }}>
                Sikeresen bejelentkeztél a BuliHub-ra.
              </p>
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
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
