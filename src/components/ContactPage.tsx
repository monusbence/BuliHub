import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './navbar';
import Footer from './footer';
import RegisterModal from './RegisterModal';
import './ContactPage.css';

const ContactPage = () => {
  // Regisztrációs modal állapota
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Kapcsolati űrlap állapota
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  // Űrlapadatok kezelése
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Űrlap beküldése a backend /api/contact végponthoz
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Űrlapadatok:', formData);

    try {
      // Használj abszolút URL-t, ha a backend külön hoston/porton fut,
      // vagy konfiguráld a proxy-t a package.json-ban és használj relatív URL-t.
      const response = await fetch('https://localhost:7248/api/Contact/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        console.error("Hiba történt az üzenet küldése során", await response.text());
      } else {
        console.log("Üzenet sikeresen elküldve");
      }
    } catch (error) {
      console.error("Hiba: ", error);
    }

    // Űrlap adatainak törlése
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  // Bejelentkezett felhasználó kinyerése a localStorage-ből
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Kijelentkezési függvény
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.location.reload();
  };

  return (
    <div className="page-container">
      <Navbar
        user={currentUser}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="contact-main-content">
        <h1>Kapcsolat</h1>
        <div className="contact-content">
          <div className="contact-info">
            <h2>Elérhetőségek</h2>
            <p><strong>Cím:</strong> 4029 Debrecen, Monostor utca 12.</p>
            <p><strong>Telefon:</strong> +36 30 332 9083</p>
            <p><strong>Email:</strong> bulihubhu@gmail.com</p>
          </div>

          <div className="contact-form">
            <h2>Írj nekünk!</h2>
            <form>
              <input
                type="text"
                name="name"
                placeholder="Név"
                value={formData.name}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <textarea
                name="message"
                placeholder="Üzenet"
                value={formData.message}
                onChange={handleChange}
                required
              />
              <button onClick={handleSubmit} type="submit">Küldés</button>
            </form>
          </div>
        </div>

        {/* OpenStreetMap térkép */}
        <div className="map-container">
          <MapContainer center={[47.5333, 21.6333]} zoom={13} style={{ height: "300px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={[47.5333, 21.6333]}>
              <Popup>Cívis utca 3</Popup>
            </Marker>
          </MapContainer>
        </div>
      </main>

      <Footer />

      {isRegisterModalOpen && (
        <RegisterModal onClose={() => setIsRegisterModalOpen(false)} />
      )}
    </div>
  );
};

export default ContactPage;
