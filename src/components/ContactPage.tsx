import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Footer from './footer';
import './ContactPage.css';

// Budapest középpont koordinátái
const center: [number, number] = [47.5333, 21.6333]; // Debrecen, Cívis utca 3.

const ContactPage = () => {
  // Állapotok a navbarhoz (mobilbarát viselkedés)
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    // Itt lehet például API hívást végezni
    setFormData({
      name: '',
      email: '',
      message: '',
    });
  };

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Bal oldali navbar */}
        <aside className={`sidebar-nav ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            <div className="sidebar-logo">
              <img src="/kepek_jegyzetek/MainLogo(png).png" alt="BuliHub Logo" />
            </div>
            <nav>
              <ul>
                <li><a href="/">Főoldal</a></li>
                <li><a href="/#section1">Szervezz Bulit</a></li>
                <li><a href="/#section2">Rólunk</a></li>
                <li><a href="/contact" className="active">Kapcsolat</a></li>
              </ul>
            </nav>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Navigációs sáv nyitása/csukása"
          >
            {isMobile ? (isSidebarOpen ? '←' : '☰') : (isSidebarOpen ? '←' : '→')}
          </button>
        </aside>

        {/* Kapcsolat tartalma */}
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
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
