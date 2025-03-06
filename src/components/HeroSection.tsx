import React from 'react';
import { motion } from 'framer-motion';

interface HeroSectionProps {
  isMobile: boolean;
  loginEmail?: string;
  loginPassword?: string;
  setLoginEmail?: React.Dispatch<React.SetStateAction<string>>;
  setLoginPassword?: React.Dispatch<React.SetStateAction<string>>;
  handleLogin?: () => void;
  onRegisterClick: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  isMobile,
  loginEmail = '',
  loginPassword = '',
  setLoginEmail = () => {},
  setLoginPassword = () => {},
  handleLogin = () => {},
  onRegisterClick
}) => {
  // Ha mobil, egyszerű bejelentkező form, ha nem mobil, akkor a forgó telefon
  if (isMobile) {
    return (
      <section id="section1" style={{ padding: '2rem', textAlign: 'center' }}>
        <h1>Üdvözöllek a BuliHub oldalán (Mobile)!</h1>
        <div style={{ maxWidth: '400px', margin: '0 auto', marginTop: '2rem' }}>
          <h2>Bejelentkezés</h2>
          <div style={{ marginBottom: '1rem', textAlign: 'left' }}>
            <label htmlFor="mobile-email">Email</label>
            <input
              type="email"
              id="mobile-email"
              style={{ width: '100%', padding: '0.5rem', marginTop: '0.3rem' }}
              placeholder="Add meg az e-mail címed"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
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
          <div style={{ marginBottom: '1rem' }}>
            <a href="#" onClick={onRegisterClick} style={{ color: '#0af' }}>
              Regisztrálj új fiókot
            </a>
          </div>
        </div>
      </section>
    );
  } else {
    // DESKTOP: marad a forgó telefonos layout
    const rotateAngle = 0; // Ha korábban volt progress, a forgás mértékét onnan vehetnéd
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

          {/* Telefon keret Framer Motion animációval */}
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

              <button className="btn login-btn" onClick={handleLogin}>
                Bejelentkezés
              </button>

              <a href="#" className="forgot-link">
                Elfelejtetted a jelszavad?
              </a>
              <a href="#" className="register-link" onClick={onRegisterClick}>
                Regisztrálj új fiókot
              </a>
            </div>

            <div className="bottom-bar">
              <div className="home-indicator"></div>
            </div>
          </motion.div>
        </div>
      </section>
    );
  }
};

export default HeroSection;
