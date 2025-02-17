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

// 12 példa esemény dummy adat
const DUMMY_EVENTS: EventItem[] = [
  {
    id: 1,
    title: 'Nagy Nyári Fesztivál',
    startDate: '2025-07-20',
    endDate: '2025-07-22',
    location: 'Budapest, Városliget',
    category: 'Fesztivál',
    imageUrl: 'https://picsum.photos/300/200?random=1',
    description: 'Ez egy nagyszabású nyári fesztivál Budapesten.',
    organizer: 'Fesztivál Szervezők',
  },
  {
    id: 2,
    title: 'Retro Disco Party',
    startDate: '2025-07-22',
    endDate: '2025-07-22',
    location: 'Debrecen, Fő tér',
    category: 'Party',
    imageUrl: 'https://picsum.photos/300/200?random=2',
    description: 'Egy retro disco buli a debreceni Fő téren.',
    organizer: 'Party Crew',
  },
  {
    id: 3,
    title: 'Tech Konferencia',
    startDate: '2025-08-05',
    endDate: '2025-08-06',
    location: 'Szeged, Konferencia Központ',
    category: 'Konferencia',
    imageUrl: 'https://picsum.photos/300/200?random=3',
    description: 'A szegedi technológiai konferencia.',
    organizer: 'Tech Innovators',
  },
  {
    id: 4,
    title: 'Koncert a Parkban',
    startDate: '2025-08-10',
    endDate: '2025-08-10',
    location: 'Miskolc, Népkert',
    category: 'Koncert',
    imageUrl: 'https://picsum.photos/300/200?random=4',
    description: 'Koncert a miskolci Népkertben.',
    organizer: 'Live Music Agency',
  },
  {
    id: 5,
    title: 'Klasszikus Zenei Est',
    startDate: '2025-09-01',
    endDate: '2025-09-01',
    location: 'Budapest, Operaház',
    category: 'Klasszikus',
    imageUrl: 'https://picsum.photos/300/200?random=5',
    description: 'Klasszikus zenei előadás az Operaházban.',
    organizer: 'Opera House',
  },
  {
    id: 6,
    title: 'Művészeti Kiállítás',
    startDate: '2025-09-10',
    endDate: '2025-09-15',
    location: 'Pécs, Művészeti Múzeum',
    category: 'Kiállítás',
    imageUrl: 'https://picsum.photos/300/200?random=6',
    description: 'Kortárs művészeti kiállítás Pécsett.',
    organizer: 'Art Gallery',
  },
  {
    id: 7,
    title: 'Gasztronómiai Fesztivál',
    startDate: '2025-10-05',
    endDate: '2025-10-07',
    location: 'Szeged, Fő tér',
    category: 'Fesztivál',
    imageUrl: 'https://picsum.photos/300/200?random=7',
    description: 'Nemzetközi ízek fesztiválja.',
    organizer: 'Foodies United',
  },
  {
    id: 8,
    title: 'Stand-Up Comedy Est',
    startDate: '2025-11-01',
    endDate: '2025-11-01',
    location: 'Budapest, Színház',
    category: 'Comedy',
    imageUrl: 'https://picsum.photos/300/200?random=8',
    description: 'Nevetés garantált a stand-up comedy esten.',
    organizer: 'Comedy Club',
  },
  {
    id: 9,
    title: 'Interaktív Workshop',
    startDate: '2025-11-10',
    endDate: '2025-11-11',
    location: 'Debrecen, Konferencia Központ',
    category: 'Workshop',
    imageUrl: 'https://picsum.photos/300/200?random=9',
    description: 'Workshop különböző témákban.',
    organizer: 'Workshop Masters',
  },
  {
    id: 10,
    title: 'Modern Tánc Előadás',
    startDate: '2025-12-05',
    endDate: '2025-12-05',
    location: 'Miskolc, Táncház',
    category: 'Tánc',
    imageUrl: 'https://picsum.photos/300/200?random=10',
    description: 'Innovatív koreográfia modern tánc előadása.',
    organizer: 'Dance Company',
  },
  {
    id: 11,
    title: 'Irodalmi Est',
    startDate: '2025-12-10',
    endDate: '2025-12-10',
    location: 'Budapest, Könyvtár',
    category: 'Irodalom',
    imageUrl: 'https://picsum.photos/300/200?random=11',
    description: 'Kortárs írók mesélnek egy irodalmi esten.',
    organizer: 'Literary Society',
  },
  {
    id: 12,
    title: 'Divatbemutató',
    startDate: '2025-12-15',
    endDate: '2025-12-15',
    location: 'Debrecen, Vásárcsarnok',
    category: 'Divat',
    imageUrl: 'https://picsum.photos/300/200?random=12',
    description: 'Év legdivatosabb bemutatója, friss trendekkel.',
    organizer: 'Fashion Hub',
  },
];

function EventsPage() {
  // Általános betöltési állapot
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsSidebarOpen(mobile ? false : true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Az események szűrése a beállított feltételek alapján
  const filteredEvents = DUMMY_EVENTS.filter((event) => {
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
    const now = new Date();
    const eventStart = new Date(event.startDate);
    const matchUpcoming = upcoming ? eventStart >= now : true;
    const eventEnd = new Date(event.endDate);
    const matchPast = past ? eventEnd < now : true;
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
              {showDetailedFilters ? 'Alap szűrés' : 'Reszletes szűrés'}
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
