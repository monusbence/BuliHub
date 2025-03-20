import React, { useState, useEffect } from 'react';
import Navbar from './navbar';
import Footer from './footer';
import './ProfilePage.css';

interface Profile {
  fullName: string;
  email: string;
}

const ProfilePage: React.FC = () => {
  // A profil adatok, amit a backendről töltünk be
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Ez a state megy át a Navbarnak, hogy ott is lássa, hogy be vagy jelentkezve
  // és kiírja a nevet a jobb oldalon.
  const [loggedInUser, setLoggedInUser] = useState<{ fullName: string; email?: string } | null>(null);

  // Állapotok a jelszó módosításhoz
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Először megnézzük a localStorage-t, hogy ott van-e a user
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      // Ha van, betöltjük, így a Navbar is látja
      setLoggedInUser(JSON.parse(storedUser));
    }

    // Ha nincs token, akkor nincs bejelentkezve
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
        // data: { fullName: string, email: string }
        setProfile(data);
        // A Navbar is ezt használja (név, email)
        setLoggedInUser({ fullName: data.fullName, email: data.email });
        setLoading(false);
      })
      .catch((err) => {
        console.error('Profil lekérés hiba:', err);
        setLoading(false);
      });
  }, []);

  // Jelszó módosítás
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

  // Kijelentkezés: töröljük a tokeneket, visszairányítunk
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
      {/* A Navbar-nak átadjuk a usert, logoutot, stb. */}
      <Navbar
        user={loggedInUser}
        onLogout={handleLogout}
        onRegisterClick={() => {}}
      />

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
