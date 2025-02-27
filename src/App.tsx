import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SplashScreen from './components/SplashScreen';
import HeroSection from './components/HeroSection';
import StatisticsSection from './components/StatisticsSection';
import CreateEventForm from './components/CreateEventForm';
import RegisterModal from './components/RegisterModal';
import './App.css';

function App() {
  // SPLASH SCREEN állapot
  const [showSplash, setShowSplash] = useState(true);

  // FELHASZNÁLÓ
  const [user, setUser] = useState<{ fullName: string } | null>(null);

  // BEJELENTKEZÉS mezők
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sikeres login overlay
  const [loginSuccessMessage, setLoginSuccessMessage] = useState(false);
  const [loginSuccessName, setLoginSuccessName] = useState('');

  // REGISZTRÁCIÓS MODAL
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Telefongörgetés (section1)
  const [locked, setLocked] = useState(true);
  const [progress, setProgress] = useState(0);

  // SPLASH SCREEN eltüntetése 4 mp után
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  // Betöltjük a user adatait localStorage-ból, ha volt
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Egérgörgő-kezelés a telefon \"feloldásához\"
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

  // -15 -> 0 fokos forgatás
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
      {/* SplashScreen */}
      <AnimatePresence>{showSplash && <SplashScreen />}</AnimatePresence>

      {/* Főkonténer */}
      <div className={`app-container ${showSplash ? 'hidden' : ''}`} onWheel={handleWheel}>
        {/* Felső navigáció */}
        <Navbar
          user={user}
          onLogout={handleLogout}
          onRegisterClick={() => setIsRegisterModalOpen(true)}
        />

        {/* 1. Szekció - Hero rész + bejelentkezés */}
        <HeroSection
          rotateAngle={rotateAngle}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          handleLogin={handleLogin}
          onRegisterClick={() => setIsRegisterModalOpen(true)}
        />

        {/* 2. Szekció - Animált statisztikák */}
        <StatisticsSection />

        {/* 3. Szekció - Esemény létrehozása */}
        <CreateEventForm user={user} />

        {/* Lábléc (már megvolt Footer.tsx néven) */}
        {!showSplash && <Footer />}
      </div>

      {/* Regisztrációs modal */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <RegisterModal onClose={() => setIsRegisterModalOpen(false)} />
        )}
      </AnimatePresence>

      {/* Sikeres bejelentkezés értesítő overlay */}
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
