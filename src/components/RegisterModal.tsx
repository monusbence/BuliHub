import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface RegisterModalProps {
  onClose: () => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose }) => {
  const [showCertifiedForm, setShowCertifiedForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Hibákhoz
  const [successMessage, setSuccessMessage] = useState(''); // Sikeres üzenethez

  // SIMA REGISZTRÁCIÓS ADATOK
  const [basicFormData, setBasicFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    birthDate: '',
    city: '',
    gender: '',
  });

  // HITELSZERVEZŐI (hitelesített) ADATOK
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
    password: '',
    confirmPassword: '',
  });

  const handleFormToggle = (isCertified: boolean) => {
    setShowCertifiedForm(isCertified);
    setErrorMessage('');
    setSuccessMessage('');
  };

  // Sima regisztráció inputkezelő
  const handleBasicInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBasicFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hitelesített regisztráció inputkezelő
  const handleCertifiedInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCertifiedFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Sima regisztráció beküldése hibakezeléssel
  const handleBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Teljes név ellenőrzése: csak az angol ábécé, magyar ékezetes karakterek és szóközök engedélyezettek
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

  // Hitelesített regisztráció beküldése (jelenleg csak figyelmeztető üzenet)
  const handleCertifiedSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('A regisztráció nem lehetséges, a hitelesített profil funkciói fejlesztés alatt áll!');
    return;
  };

  return (
    <div className="modal-wrapper">
      <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
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

        {/* Sima regisztrációs űrlap hibakezeléssel */}
        {!showCertifiedForm ? (
          <form onSubmit={handleBasicSubmit} className="certified-form">
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

            {/* Hibák és sikeres üzenetek megjelenítése */}
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
        ) : (
          /* Hitelesített szervezői űrlap */
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
              <label htmlFor="password">Jelszó</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="******"
                value={certifiedFormData.password}
                onChange={handleCertifiedInputChange}
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
                value={certifiedFormData.confirmPassword}
                onChange={handleCertifiedInputChange}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="btn submit-btn"
              disabled
              style={{
                backgroundColor: '#ccc',
                cursor: 'not-allowed',
              }}
            >
              Regisztráció
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default RegisterModal;
