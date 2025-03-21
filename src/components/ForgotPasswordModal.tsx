import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ForgotPasswordModalProps {
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('https://localhost:7248/api/auth/forgotpassword', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        setMessage('Ha az email létezik, elküldtük a jelszó emlékeztetőt.');
      } else {
        const errorText = await response.text();
        setMessage('Hiba történt: ' + errorText);
      }
    } catch (error) {
      setMessage('Hiba történt a kérés során.');
    }
  };

  return (
    <div className="modal-wrapper">
      <motion.div className="modal-overlay"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}/>
      <motion.div className="modal-container"
          initial={{ opacity: 0, scale: 0.75 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.75 }}>
        <div className="modal-header">
          <h2>Elfelejtett jelszó</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        {message ? (
          <p>{message}</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="forgot-email" style={{ color: 'black' }}>Email</label>
              <input
              style={{ color: 'white', backgroundColor: 'gray', border:'black' }}
                type="email"
                id="forgot-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn submit-btn">Küldés</button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordModal;
