import React, { useState, useEffect } from 'react';
import Footer from './footer';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './ContactPage.css';

const mapContainerStyle = {
  width: '100%',
  height: '300px',
};

const center = {
  lat: 47.497913, // Budapest koordináta (példa)
  lng: 19.040236,
};

const mapOptions = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ],
  disableDefaultUI: true,
};

const ContactPage = () => {
  // Állapotok a navbarhoz
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
              <img
                src="/kepek_jegyzetek/MainLogo(png).png"
                alt="BuliHub Logo"
              />
            </div>
            <nav>
              <ul>
                <li>
                  <a href="/">Főoldal</a>
                </li>
                <li>
                  <a href="/#section1">Szervezz Bulit</a>
                </li>
                <li>
                  <a href="/#section2">Rólunk</a>
                </li>
                <li>
                  <a href="/#section3">Kapcsolat</a>
                </li>
                <li>
                  <a href="/contact" className="active">
                    Kapcsolat
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          <button
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            aria-label="Navigációs sáv nyitása/csukása"
          >
            {isMobile
              ? isSidebarOpen
                ? '←'
                : '☰'
              : isSidebarOpen
              ? '←'
              : '→'}
          </button>
        </aside>

        {/* Kapcsolat tartalma */}
        <main className="contact-main-content">
          <h1>Kapcsolat</h1>
          <div className="contact-content">
            <div className="contact-info">
              <h2>Elérhetőségek</h2>
              <p>
                <strong>Cím:</strong> 1234 Budapest, Példa utca 1.
              </p>
              <p>
                <strong>Telefon:</strong> +36 30 123 4567
              </p>
              <p>
                <strong>Email:</strong> info@pelda.hu
              </p>
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
          <div className="map-container">
            <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={center}
                zoom={15}
                options={mapOptions}
              >
                <Marker position={center} />
              </GoogleMap>
            </LoadScript>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
