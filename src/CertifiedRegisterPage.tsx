// CertifiedRegisterPage.tsx

import React, { useState } from 'react';
import './App.css';  // ugyanaz a CSS, hogy egységes legyen a design

const CertifiedRegisterPage: React.FC = () => {
  // NAVBAR hamburger logika
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // Form state
  const [formData, setFormData] = useState({
    companyName: '',
    taxNumber: '',
    address: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Jelszók ellenőrzése
    if (formData.password !== formData.confirmPassword) {
      alert('A két jelszó nem egyezik!');
      return;
    }
    // Itt jöhetne pl. egy API-hívás
    console.log('Hitelesített regisztrációs adatok:', formData);
    alert('Sikeres regisztráció a hitelesített buliszervezők között!');
  };

  return (
    <div className="app-container" style={{ overflow: 'auto' }}>
      {/* NAVBAR – bemásoljuk az App.tsx-ből (ugyanaz, csak a linkek maradnak) */}
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
            {/* Ha akarsz, csinálhatod, hogy visszavisz a főoldalra: */}
            <a href="/" onClick={() => setIsMenuOpen(false)}>
              Főoldal
            </a>
          </li>
          <li>
            <a href="/#section2" onClick={() => setIsMenuOpen(false)}>
              Események
            </a>
          </li>
          <li>
            <a href="/#section3" onClick={() => setIsMenuOpen(false)}>
              Kapcsolat
            </a>
          </li>
          <li>
            <a href="/certified" onClick={() => setIsMenuOpen(false)}>
              Hitelesített szervező vagyok
            </a>
          </li>
        </ul>
      </nav>

      {/* Tartalom */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          paddingTop: '60px', // hogy ne takarja el a navbar
          backgroundColor: '#000', // pl. fekete háttér
        }}
      >
        <h1 style={{ color: '#fff', marginBottom: '2rem' }}>
          Hitelesített szervezői regisztráció
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            padding: '2rem',
            width: '90%',
            maxWidth: '500px',
          }}
        >
          {/* Cégnév */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="companyName" style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>
              Cégnév / Szórakozóhely neve
            </label>
            <input
              type="text"
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.75rem' }}
            />
          </div>

          {/* Adószám */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="taxNumber" style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>
              Adószám
            </label>
            <input
              type="text"
              id="taxNumber"
              name="taxNumber"
              value={formData.taxNumber}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.75rem' }}
            />
          </div>

          {/* Cím */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="address" style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>
              Cég / Szórakozóhely cím
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Pl. Budapest, Fő utca 10."
              value={formData.address}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.75rem' }}
            />
          </div>

          {/* Telefonszám */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="phone" style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>
              Telefonszám
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="+36-30-123-4567"
              value={formData.phone}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.75rem' }}
            />
          </div>

          {/* E-mail */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="email" style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>
              Céges E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.75rem' }}
            />
          </div>

          {/* Jelszó */}
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password" style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>
              Jelszó
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.75rem' }}
            />
          </div>

          {/* Jelszó megerősítése */}
          <div style={{ marginBottom: '2rem' }}>
            <label htmlFor="confirmPassword" style={{ color: '#fff', display: 'block', marginBottom: '0.3rem' }}>
              Jelszó megerősítése
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              style={{ width: '100%', padding: '0.75rem' }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: '#c841c6',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              fontSize: '1rem',
              cursor: 'pointer',
            }}
          >
            Regisztráció
          </button>
        </form>
      </div>
    </div>
  );
};

export default CertifiedRegisterPage;
