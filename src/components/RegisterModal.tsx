import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RegisterModalProps {
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
  const [showCertifiedForm, setShowCertifiedForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Hibákhoz
  const [successMessage, setSuccessMessage] = useState(''); // Sikeres üzenethez

  const [basicFormData, setBasicFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    city: '',
    gender: '',
  });

  const handleFormToggle = (isCertified: boolean) => {
    setShowCertifiedForm(isCertified);
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleBasicInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBasicFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Első lépésként ellenőrizzük a "Teljes név" mezőt speciális karakterekre.
    // Csak az angol ábécé és a magyar ékezetes karakterek, illetve a szóközök engedélyezettek.
    const nameRegex = /^[A-Za-zÁÉÍÓÖŐÚÜŰáéíóöőúüű\s]+$/;
    if (!nameRegex.test(basicFormData.fullName)) {
      setErrorMessage('A teljes név csak betűket és szóközt tartalmazhat.');
      setSuccessMessage('');
      return;
    }

    if (basicFormData.password !== basicFormData.confirmPassword) {
      setErrorMessage('A két jelszó nem egyezik!');
      setSuccessMessage('');
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
        setErrorMessage('Regisztráció sikertelen: ' + (errorData.message || 'Ismeretlen hiba.'));
        setSuccessMessage('');
      } else {
        setErrorMessage('');
        setSuccessMessage('Sikeres regisztráció!');
      }
    } catch (error) {
      console.error('Hiba a regisztráció során:', error);
      setErrorMessage('Hálózati hiba – kérlek próbáld újra később.');
      setSuccessMessage('');
    }

    // Űrlap törlése
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

  return (
    <div className="modal-wrapper">
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        className="modal-container"
        initial={{ opacity: 0, scale: 0.75 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.75 }}
      >
        <div className="modal-header">
          <h2>{showCertifiedForm ? 'Hitelesített Szervezői Regisztráció' : 'Regisztráció'}</h2>
          <button className="close-btn" onClick={onClose}>
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
            <div className="form-group">
              <label htmlFor="fullName">Teljes név</label>
              <input
                type="text"
                name="fullName"
                value={basicFormData.fullName}
                onChange={handleBasicInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" name="email" value={basicFormData.email} onChange={handleBasicInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="password">Jelszó</label>
              <input type="password" name="password" value={basicFormData.password} onChange={handleBasicInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Jelszó megerősítése</label>
              <input
                type="password"
                name="confirmPassword"
                value={basicFormData.confirmPassword}
                onChange={handleBasicInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="birthDate">Születési dátum</label>
              <input type="date" name="birthDate" value={basicFormData.birthDate} onChange={handleBasicInputChange} required />
            </div>

            <div className="form-group">
              <label htmlFor="city">Város</label>
              <input type="text" name="city" value={basicFormData.city} onChange={handleBasicInputChange} />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Nem</label>
              <select name="gender" value={basicFormData.gender} onChange={handleBasicInputChange} required>
                <option value="">Válassz nemet</option>
                <option value="ferfi">Férfi</option>
                <option value="no">Nő</option>
              </select>
            </div>

            <motion.button type="submit" className="btn submit-btn" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Regisztráció
            </motion.button>

            {/* Hibák megjelenítése */}
            {errorMessage && (
              <p
                style={{
                  marginTop: '1rem',
                  color: '#ff4d4f',
                  backgroundColor: '#2a0000',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {errorMessage}
              </p>
            )}

            {/* Sikeres üzenet megjelenítése */}
            {successMessage && (
              <p
                style={{
                  marginTop: '1rem',
                  color: '#4caf50',
                  backgroundColor: '#e8f5e9',
                  padding: '0.8rem',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  textAlign: 'center',
                }}
              >
                {successMessage}
              </p>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterModal;
