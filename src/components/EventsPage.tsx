import React, { useState, useEffect } from 'react';
import Footer from './footer';
import './EventsPage.css';

interface EventItem {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  category: string;
  imageUrl: string;
  description: string;
  organizer: string;
}

function EventsPage() {
  // Általános betöltési állapot
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]); // <-- A backendről jövő események itt tárolódnak

  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Alap szűrési állapotok
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');

  // Részletes szűrés elrejtése/megmutatása
  const [showDetailedFilters, setShowDetailedFilters] = useState(false);

  // Részletes szűrési állapotok
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [organizerFilter, setOrganizerFilter] = useState('');
  const [upcoming, setUpcoming] = useState(false);
  const [past, setPast] = useState(false);
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');

  // A kiválasztott esemény a modalhoz
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // ESEMÉNYEK LEKÉRÉSE A BACKENDRŐL
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://localhost:7248/api/Events', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`Hiba az események lekérése közben: ${response.status} ${response.statusText}`);
        }

        // Válasz JSON
        const data: any[] = await response.json(); // A valós adatszerkezet
        // Mappelés a front-end által használt mezőkre
        const mappedEvents: EventItem[] = data.map((ev: any) => ({
          id: ev.id,
          title: ev.name || 'Esemény címe',
          startDate: ev.startDate || '',
          endDate: ev.endDate || '',
          location: ev.locationName || 'Ismeretlen helyszín',
          category: ev.theme || 'Egyéb',  // Esetleg 'Fesztivál', 'Koncert' stb. ha a theme megfelel
          imageUrl: `https://picsum.photos/300/200?random=${ev.id}`, // Ide tehetsz fix URL-t is
          description: ev.description || '',
          organizer: ev.provider?.user?.name ?? 'Ismeretlen szervező'
          // Ha nincs Provider object, ez a szervező mező 'Ismeretlen szervező' lesz
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Oldal újraméretezés figyelése
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(mobile ? false : true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Események szűrése a beállított feltételek alapján
  const filteredEvents = events.filter((event) => {
    const matchKeyword =
      event.title.toLowerCase().includes(keyword.toLowerCase()) ||
      event.location.toLowerCase().includes(keyword.toLowerCase());

    const matchCategory = category ? event.category === category : true;
    const matchFromDate = fromDate ? new Date(event.startDate) >= new Date(fromDate) : true;
    const matchToDate = toDate ? new Date(event.startDate) <= new Date(toDate) : true;
    const matchLocation = locationFilter
      ? event.location.toLowerCase().includes(locationFilter.toLowerCase())
      : true;
    const matchOrganizer = organizerFilter
      ? event.organizer.toLowerCase().includes(organizerFilter.toLowerCase())
      : true;

    // upcoming / past
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const matchUpcoming = upcoming ? eventStart >= now : true;
    const eventEnd = new Date(event.endDate);
    const matchPast = past ? eventEnd < now : true;

    // időtartam-szűrés
    const durationInDays =
      (new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 3600 * 24) + 1;
    const matchMinDuration = minDuration ? durationInDays >= parseInt(minDuration) : true;
    const matchMaxDuration = maxDuration ? durationInDays <= parseInt(maxDuration) : true;

    return (
      matchKeyword &&
      matchCategory &&
      matchFromDate &&
      matchToDate &&
      matchLocation &&
      matchOrganizer &&
      matchUpcoming &&
      matchPast &&
      matchMinDuration &&
      matchMaxDuration
    );
  });

  if (isLoading) {
    return (
      <div className="preloader">
        <div className="loading-bar"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-wrapper">
        {/* Oldalsó menü */}
        <aside className={`sidebar-nav ${isSidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            <div className="sidebar-logo">
              <img src="/kepek_jegyzetek/MainLogo(png).png" alt="BuliHub Logo" />
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
                  <a href="/events" className="active">
                    Események
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
            {isMobile ? (
              <span className="hamburger-icon"></span>
            ) : (
              isSidebarOpen ? '←' : '→'
            )}
          </button>
        </aside>

        {/* Fő tartalom */}
        <main className="events-main-content">
          <h1>Események</h1>
          <p>Válogass a legfrissebb események közül, vagy szűrj rá!</p>

          {/* Szűrősáv: alap szűrés + gomb a részletes szűréshez */}
          <div className="filter-bar">
            <input
              type="text"
              placeholder="Keresés cím vagy helyszín alapján..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Minden kategória</option>
              <option value="Fesztivál">Fesztivál</option>
              <option value="Party">Party</option>
              <option value="Konferencia">Konferencia</option>
              <option value="Koncert">Koncert</option>
              <option value="Klasszikus">Klasszikus</option>
              <option value="Kiállítás">Kiállítás</option>
              <option value="Comedy">Comedy</option>
              <option value="Workshop">Workshop</option>
              <option value="Tánc">Tánc</option>
              <option value="Irodalom">Irodalom</option>
              <option value="Divat">Divat</option>
            </select>
            <button onClick={() => setShowDetailedFilters(!showDetailedFilters)}>
              {showDetailedFilters ? 'Alap szűrés' : 'Részletes szűrés'}
            </button>

            {showDetailedFilters && (
              <>
                <input
                  type="date"
                  placeholder="Kezdés dátum (tól)"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
                <input
                  type="date"
                  placeholder="Kezdés dátum (ig)"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Helyszín szerinti szűrés..."
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Szervező szerinti szűrés..."
                  value={organizerFilter}
                  onChange={(e) => setOrganizerFilter(e.target.value)}
                />
                <label>
                  <input
                    type="checkbox"
                    checked={upcoming}
                    onChange={(e) => setUpcoming(e.target.checked)}
                  />
                  Közelgő
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={past}
                    onChange={(e) => setPast(e.target.checked)}
                  />
                  Lejárt
                </label>
                <input
                  type="number"
                  placeholder="Min. napok száma"
                  value={minDuration}
                  onChange={(e) => setMinDuration(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max. napok száma"
                  value={maxDuration}
                  onChange={(e) => setMaxDuration(e.target.value)}
                />
              </>
            )}
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
                      <strong>Kezdés:</strong> {event.startDate}
                    </p>
                    <p>
                      <strong>Helyszín:</strong> {event.location}
                    </p>
                    <p>
                      <strong>Kategória:</strong> {event.category}
                    </p>
                    <button className="btn-details" onClick={() => setSelectedEvent(event)}>
                      Részletek
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>

      {/* Modal a részletes eseményadatokhoz (a képpel együtt) */}
      {selectedEvent && (
        <div className="modal">
          <div className="modal-content">
            <img
              src={selectedEvent.imageUrl}
              alt={selectedEvent.title}
              style={{ width: '100%', marginBottom: '1rem' }}
            />
            <h2>{selectedEvent.title}</h2>
            <p>
              <strong>Leírás:</strong> {selectedEvent.description}
            </p>
            <p>
              <strong>Kezdés:</strong> {selectedEvent.startDate}
            </p>
            <p>
              <strong>Befejezés:</strong> {selectedEvent.endDate}
            </p>
            <p>
              <strong>Helyszín:</strong> {selectedEvent.location}
            </p>
            <p>
              <strong>Szervező:</strong> {selectedEvent.organizer}
            </p>
            <button onClick={() => setSelectedEvent(null)}>Bezár</button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default EventsPage;
