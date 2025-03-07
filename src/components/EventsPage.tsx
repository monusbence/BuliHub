import React, { useState, useEffect } from 'react';
import Footer from './footer';
import Navbar from './navbar';
import './EventsPage.css';

// Időpont formázása: 2025.12.09 19:30
function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  const dateObj = new Date(dateString);
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  return `${year}.${month}.${day} ${hours}:${minutes}`;
}

// Esemény interface
interface EventItem {
  id: number;
  title: string;        // => name (backend)
  description: string;
  startDate: string;
  endDate: string;
  location: string;     // => locationName
  address: string;      // => address
  equipment: string;    // => equipment
  organizer: string;    // => organizerName
  category: string;     // => theme
  imageUrl: string;
}

function EventsPage() {
  // Betöltés, események
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);

  // Szűrés
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [showDetailedFilters, setShowDetailedFilters] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [organizerFilter, setOrganizerFilter] = useState('');
  const [upcoming, setUpcoming] = useState(false);
  const [past, setPast] = useState(false);
  const [minDuration, setMinDuration] = useState('');
  const [maxDuration, setMaxDuration] = useState('');

  // Modal
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  // Lekérés a backendről
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://localhost:7248/api/Events', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
          throw new Error(`Hiba: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('=== DEBUG: Raw events from server ===', data);

        // Mappeljük a frontendi mezőkre
        const mapped: EventItem[] = data.map((ev: any) => ({
          id: ev.id,
          title: ev.name || 'Esemény címe',
          description: ev.description || '',
          startDate: ev.startDate,
          endDate: ev.endDate,
          location: ev.locationName || 'Ismeretlen helyszín',
          address: ev.address || '',
          equipment: ev.equipment || '',
          organizer: ev.organizerName || 'Ismeretlen szervező',
          category: ev.theme || 'Egyéb',
          imageUrl: `https://picsum.photos/300/200?random=${ev.id}`
        }));

        console.log('=== DEBUG: Mapped events ===', mapped);
        setEvents(mapped);
      } catch (error) {
        console.error('Hiba a fetchEvents során:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Szűrt lista
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

    const now = new Date();
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);

    const matchUpcoming = upcoming ? eventStart >= now : true;
    const matchPast = past ? eventEnd < now : true;

    const durationInDays =
      (eventEnd.getTime() - eventStart.getTime()) / (1000 * 3600 * 24) + 1;
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

  // Ha épp betölt (loader)
  if (isLoading) {
    return (
      <div className="preloader">
        <div className="loading-bar"></div>
      </div>
    );
  }

  // Render
  return (
    <div className="page-container">
      {/* FELSŐ NAVBAR (hamburger) */}
      <Navbar />

      {/* Eseménylista tartalom */}
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
                    <strong>Kezdés:</strong> {formatDateTime(event.startDate)}
                  </p>
                  <p>
                    <strong>Befejezés:</strong> {formatDateTime(event.endDate)}
                  </p>
                  <p>
                    <strong>Helyszín:</strong> {event.location}
                  </p>
                  {event.address && <p>Cím: {event.address}</p>}
                  {event.equipment && <p>Extrák: {event.equipment}</p>}
                  <p>
                    <strong>Kategória:</strong> {event.category}
                  </p>
                  <p>
                    <strong>Szervező:</strong> {event.organizer}
                  </p>
                  <button
                    className="btn-details"
                    onClick={() => setSelectedEvent(event)}
                  >
                    Részletek
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Részletek Modal */}
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
              <strong>Kezdés:</strong> {formatDateTime(selectedEvent.startDate)}
            </p>
            <p>
              <strong>Befejezés:</strong> {formatDateTime(selectedEvent.endDate)}
            </p>
            <p>
              <strong>Helyszín:</strong> {selectedEvent.location}
            </p>
            {selectedEvent.address && <p>Cím: {selectedEvent.address}</p>}
            {selectedEvent.equipment && <p>Extrák: {selectedEvent.equipment}</p>}
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
