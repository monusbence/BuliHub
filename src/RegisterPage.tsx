// RegisterPage.tsx

import React, { useState } from 'react';
import './App.css';  // vagy ha van külön CSS, importáld: import './RegisterPage.css';

const Register: React.FC = () => {
  // --- NAVBAR ÁLLAPOT --- //
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // --- REGISZTRÁCIÓS FORM ÁLLAPOT --- //
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    city: '',
    gender: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Alap jelszóellenőrzés
    if (formData.password !== formData.confirmPassword) {
      alert('A két jelszó nem egyezik!');
      return;
    }

    // Ide jöhet API-hívás vagy egyéb logika
    console.log('Regisztrációs adatok:', formData);
    alert('Sikeres regisztráció!');
  };

  return (
    <div className="app-container" style={{ overflow: 'auto' }}>
      
      {/* NAVBAR (bemásolva az App.tsx-ből) */}
      <nav className="navbar">
        <div className="logo">
          <img src="./kepek_jegyzetek/MainLogo(png).png" alt="BuliHub Logo" />
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

      {/* FŐ TARTALOM: balra a logó, jobbra a form */}
      <div
        className="register-content"
        style={{
          display: 'flex',
          minHeight: '100vh',
        }}
      >
        {/* Bal oldal - AppLogo(png).png */}
        <div
          className="left-column"
          style={{
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
          }}
        >
          <img
            src="./kepek_jegyzetek/AppLogo(png).png"
            alt="App Logo"
            style={{ width: '500px', height: 'auto' }}
          />
        </div>

        {/* Jobb oldal - regisztrációs form */}
        <div
          className="right-column"
          style={{
            flex: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#222',
          }}
        >
          <form
            onSubmit={handleSubmit}
            style={{
              maxWidth: '400px',
              width: '100%',
              background: 'rgba(255,255,255,0.1)',
              padding: '2rem',
              borderRadius: '1rem',
            }}
          >
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
              Regisztráció
            </h2>

            {/* Teljes név */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="fullName"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                Teljes név
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                placeholder="Add meg a neved"
                value={formData.fullName}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                }}
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="email"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                }}
              />
            </div>

            {/* Jelszó */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="password"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                Jelszó
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="********"
                value={formData.password}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                }}
              />
            </div>

            {/* Jelszó megerősítése */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="confirmPassword"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                Jelszó megerősítése
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="********"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                }}
              />
            </div>

            {/* Születési dátum (date picker) */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="birthDate"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                Születési dátum
              </label>
              <input
                type="date"
                id="birthDate"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                }}
              />
            </div>

            {/* Város */}
            <div style={{ marginBottom: '1rem' }}>
              <label
                htmlFor="city"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                Város
              </label>
              <input
                type="text"
                id="city"
                name="city"
                placeholder="Pl.: Budapest"
                value={formData.city}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                }}
              />
            </div>

            {/* Nem (lenyíló lista) */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label
                htmlFor="gender"
                style={{ display: 'block', marginBottom: '0.5rem' }}
              >
                Nem
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                required
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  borderRadius: '4px',
                  border: 'none',
                }}
              >
                <option value="">Válassz nemet</option>
                <option value="férfi">Férfi</option>
                <option value="nő">Nő</option>
              </select>
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
              Hitelesített szervezőként regisztrálok
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
