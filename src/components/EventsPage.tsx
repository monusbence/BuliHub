import React, { useState } from 'react';
import Footer from './footer'; 
import './EventsPage.css';    

interface EventItem {
  id: number;
  title: string;
  date: string;
  location: string;
  category: string;
  imageUrl: string;
}

const DUMMY_EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Nagy Nyári Fesztivál',
    date: '2025-07-20',
    location: 'Budapest, Városliget',
    category: 'Fesztivál',
    imageUrl: 'https://picsum.photos/300/200?random=1',
  },
  {
    id: 2,
    title: 'Retro Disco Party',
    date: '2025-07-22',
    location: 'Debrecen, Fő tér',
    category: 'Party',
    imageUrl: 'https://picsum.photos/300/200?random=2',
  },
  {
    id: 3,
    title: 'Tech konferencia',
    date: '2025-08-05',
    location: 'Szeged, Konferencia Központ',
    category: 'Konferencia',
    imageUrl: 'https://picsum.photos/300/200?random=3',
  },
  {
    id: 4,
    title: 'Koncert a parkban',
    date: '2025-08-10',
    location: 'Miskolc, Népkert',
    category: 'Koncert',
    imageUrl: 'https://picsum.photos/300/200?random=4',
  },
];

const EventsPage: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  const filteredEvents = DUMMY_EVENTS.filter((event) => {
    const matchKeyword =
      event.title.toLowerCase().includes(keyword.toLowerCase()) ||
      event.location.toLowerCase().includes(keyword.toLowerCase());

    const matchCategory = category ? event.category === category : true;

    return matchKeyword && matchCategory;
  });

  return (
    <div className="events-page-container">
      <aside className="sidebar-nav">
        <div className="sidebar-logo">
          {}
          <img
            src="/kepek_jegyzetek/MainLogo.png"
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
              <a href="/events" className="active">Események</a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="events-main-content">
        <h1>Események</h1>
        <p>Válogass a legfrissebb események közül, vagy szűrj rá!</p>

        {/* Szűrősáv */}
        <div className="filter-bar">
          <input
            type="text"
            placeholder="Keresés cím vagy helyszín alapján..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Minden kategória</option>
            <option value="Koncert">Koncert</option>
            <option value="Party">Party</option>
            <option value="Fesztivál">Fesztivál</option>
            <option value="Konferencia">Konferencia</option>
          </select>
        </div>

        {/* Eseménykártyák */}
        <div className="events-grid">
          {filteredEvents.length === 0 ? (
            <p>Nincs megjeleníthető esemény a szűrésnek megfelelően.</p>
          ) : (
            filteredEvents.map((event) => (
              <div className="event-card" key={event.id}>
                <img src={event.imageUrl} alt={event.title} />
                <div className="event-card-content">
                  <h3>{event.title}</h3>
                  <p>
                    <strong>Dátum:</strong> {event.date}
                  </p>
                  <p>
                    <strong>Helyszín:</strong> {event.location}
                  </p>
                  <p>
                    <strong>Kategória:</strong> {event.category}
                  </p>
                  <button className="btn-details">Részletek</button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default EventsPage;
