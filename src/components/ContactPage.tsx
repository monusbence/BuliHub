import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Navbar from './navbar';
import Footer from './footer';
import './ContactPage.css';

// Budapest középpont koordinátái
const center: [number, number] = [47.5333, 21.6333]; // Debrecen, Cívis utca 3.

const ContactPage = () => {
  // Kapcsolati űrlap állapota
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Űrlapadatok:', formData);
    // Itt lehet például API-hívást végezni
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <div className="page-container">
      {/* Felső Navbar hamburger menüvel */}
      <Navbar />

      <main className="contact-main-content">
        <h1>Kapcsolat</h1>
        <div className="contact-content">
          <div className="contact-info">
            <h2>Elérhetőségek</h2>
            <p><strong>Cím:</strong> 1234 Budapest, Példa utca 1.</p>
            <p><strong>Telefon:</strong> +36 30 123 4567</p>
            <p><strong>Email:</strong> info@pelda.hu</p>
          </div>

          <div className="contact-form">
            <h2>Írj nekünk!</h2>
            <form onSubmit={handleSubmit}>
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
              <button type="submit">Küldés</button>
            </form>
          </div>
        </div>

        {/* OpenStreetMap térkép Leaflet.js segítségével */}
        <div className="map-container">
          <MapContainer center={center} zoom={13} style={{ height: "300px", width: "100%" }}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={center}>
              <Popup>Cívis utca 3</Popup>
            </Marker>
          </MapContainer>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
