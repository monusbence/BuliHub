import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  rotateAngle?: number;
  loginEmail?: string;
  loginPassword?: string;
  setLoginEmail?: React.Dispatch<React.SetStateAction<string>>;
  setLoginPassword?: React.Dispatch<React.SetStateAction<string>>;
  handleLogin?: () => void;
  onRegisterClick: () => void;
  onForgotPasswordClick: () => void;
  user?: { fullName: string } | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  rotateAngle = 0,
  loginEmail = '',
  loginPassword = '',
  setLoginEmail = () => {},
  setLoginPassword = () => {},
  handleLogin = () => {},
  onRegisterClick,
  onForgotPasswordClick,
  user = null,
}) => {
  const [mobileMode, setMobileMode] = useState(false);

  useEffect(() => {
    const checkWidth = () => {
      setMobileMode(window.innerWidth <= 767);
    };
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  // Ha Entert nyom a jelszómezőben, indítsa a bejelentkezést
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Függvény: bejelentkezett felhasználó üdvözlő szövege (háttér nélkül)
  const getLoggedInMessage = () => {
    return (
      <div
        style={{
          backgroundColor: 'transparent',
          padding: '0',
          borderRadius: '0',
          textAlign: 'center',
          boxShadow: 'none',
          marginTop: '1rem',
        }}
      >
        <h3 style={{ margin: '0', color: '#c841c6' }}>Üdvözlünk!</h3>
        <p style={{ margin: '0.5rem 0 0', fontWeight: 'bold', color: '#f8f8f8' }}>
          Már be vagy jelentkezve, {user?.fullName}!
        </p>
      </div>
    );
  };

  // *** MOBIL NÉZET ***
  if (mobileMode) {
    return (
      <section id="section1" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Üdvözöllek a BuliHub oldalán!</h1>
        <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '2rem', fontSize:'30px'}}>
          {/* Csak akkor mutatjuk a címet, ha NINCS bejelentkezve */}
          {!user && <h2>Bejelentkezés</h2>}

          {user ? (
            getLoggedInMessage()
          ) : (
            <>
              <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                <label htmlFor="mobile-email">Email</label>
                <input
                  type="email"
                  id="mobile-email"
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
                  placeholder="Add meg az e-mail címed"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
                <label htmlFor="mobile-password">Jelszó</label>
                <input
                  type="password"
                  id="mobile-password"
                  style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
                  placeholder="Add meg a jelszavad"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <button
                style={{
                  width: '100%',
                  padding: '0.8rem',
                  backgroundColor: '#c841c6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '5px',
                  marginBottom: '1rem',
                  fontWeight: 'bold',
                }}
                onClick={handleLogin}
              >
                Bejelentkezés
              </button>
            </>
          )}

          {!user && (
            <div style={{ marginBottom: '1rem' }}>
              <a
                href="#"
                className="forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  onForgotPasswordClick();
                }}
              >
                Elfelejtetted a jelszavad?
              </a>
              <br />
              <a href="#" onClick={onRegisterClick} style={{ color: '#0af' }}>
                Regisztrálj új fiókot
              </a>
            </div>
          )}
        </div>
      </section>
    );
  }

  // *** TELEFONOS NÉZET (desktop, nagyobb képernyő) ***
  return (
    <section id="section1">
      <div className="section1-content">
        <div className="text">
          <h1>Üdvözöllek a BuliHub oldalán!</h1>
          <div className="store-buttons">
            <img src="./src/google-play.png" alt="Google Play" className="store-icon" />
            <img src="./src/app-storee.png" alt="App Store" className="store-icon" />
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
            <img src="./kepek_jegyzetek/MainLogo(png).png" alt="logo" className="logo-img" />

            {/* Csak akkor mutatjuk a címet, ha NINCS bejelentkezve */}
            {!user && <h2 className="login-title">Bejelentkezés</h2>}

            {user ? (
              // Ha be van jelentkezve, nincs szürke háttér, csak az üdvözlés
              getLoggedInMessage()
            ) : (
              <>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Add meg az e-mail címed"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    onKeyDown={handleKeyDown}
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
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <button className="btn login-btn" onClick={handleLogin}>
                  Bejelentkezés
                </button>
              </>
            )}

            {!user && (
              <>
                <a
                  href="#"
                  className="forgot-link"
                  onClick={(e) => {
                    e.preventDefault();
                    onForgotPasswordClick();
                  }}
                >
                  Elfelejtetted a jelszavad?
                </a>
                <a href="#" className="register-link" onClick={onRegisterClick}>
                  Regisztrálj új fiókot
                </a>
              </>
            )}
          </div>
          <div className="bottom-bar">
            <div className="home-indicator"></div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
