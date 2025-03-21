import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './ProfilePage.css';

interface Profile {
  fullName: string;
  email: string;
  birthDate?: string;
  city?: string;
  // A backend esetleg számként vagy stringként adja vissza a gender értéket
  gender?: number | string;
}

const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Állapotok a jelszó módosításhoz
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  // A Navbar számára, hogy lássa, ki van bejelentkezve
  const [loggedInUser, setLoggedInUser] = useState<{ fullName: string; email?: string } | null>(null);

  // Segédfüggvény a gender konvertálására
  const getGenderText = (gender?: number | string) => {
    const g = Number(gender);
    if (g === 1) return "Férfi";
    if (g === 0) return "Nő";
    return "";
  };

  useEffect(() => {
    // LocalStorage-ból betöltjük a user adatait, ha vannak
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }

    // Ha nincs token, nincs bejelentkezve
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setLoading(false);
      return;
    }

    // Lekérjük a user adatait a backendről, pl. GET /api/Profile/me
    fetch('https://localhost:7248/api/Profile/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        return res.json();
      })
      .then((data) => {
        // A backend a következő mezőket adja vissza: fullName, email, birthDate, city, gender
        setProfile(data);
        setLoggedInUser({ fullName: data.fullName, email: data.email });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Profil lekérés hiba:', err);
        setLoading(false);
      });
  }, []);

  // Jelszó módosítás kezelése
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setMessage('Az új jelszó és a megerősítés nem egyezik.');
      return;
    }
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setMessage('Nincs bejelentkezve.');
      return;
    }
    try {
      const response = await fetch('https://localhost:7248/api/Profile/changepassword', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      if (response.ok) {
        setMessage('Jelszó sikeresen módosítva.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        const errText = await response.text();
        setMessage('Hiba: ' + errText);
      }
    } catch (error) {
      console.error('Jelszó módosítás hiba:', error);
      setMessage('Hiba történt a kérés során.');
    }
  };

  // Kijelentkezés kezelése
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>
        Betöltés...
      </div>
    );
  }

  return (
    <div className="container">
      <Navbar user={loggedInUser} onLogout={handleLogout} onRegisterClick={() => {}} />

      <div className="profile-container">
        <h1>Profilom</h1>
        {profile && (
          <div className="profile-info">
            <p>
              <strong>Név:</strong> {profile.fullName}
            </p>
            <p>
              <strong>Email:</strong> {profile.email}
            </p>
            <p>
              <strong>Születési dátum:</strong> {profile.birthDate}
            </p>
            <p>
              <strong>Város:</strong> {profile.city}
            </p>
            <p>
              <strong>Neme:</strong> {getGenderText(profile.gender)}
            </p>
          </div>
        )}

        <div className="password-change">
          <h2>Jelszó módosítása</h2>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="currentPassword">Jelenlegi jelszó</label>
              <input
                type="password"
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">Új jelszó</label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Új jelszó megerősítése</label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn submit-btn">
              Jelszó módosítása
            </button>
          </form>
          {message && <p className="message">{message}</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProfilePage;
