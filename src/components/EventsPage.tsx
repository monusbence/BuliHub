import React, { useState, useEffect } from 'react';
import Footer from './footer';
import Navbar from './navbar';
import RegisterModal from './RegisterModal';
import './EventsPage.css';

// Segédfüggvény az időpont formázásához (pl. 2025.12.09 19:30)
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

interface EventItem {
  id: number;
  title: string;        // frontend: a buli neve (backend: Name)
  description: string;
  startDate: string;
  endDate: string;
  location: string;     // backend: locationName
  address: string;      // backend: address
  equipment: string;    // backend: equipment
  organizer: string;    // backend: organizerName
  category: string;     // frontend: kategória (backend: Theme)
  imageUrl: string;
  guests: number;
}

const EventsPage: React.FC = () => {
  // Állapotok az események és betöltés kezelésére
  const [isLoading, setIsLoading] = useState(true);
  const [events, setEvents] = useState<EventItem[]>([]);

  // Szűrőmezők
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
  // Saját bulik jelölő
  const [myEvents, setMyEvents] = useState(false);

  // Modálok
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [editEvent, setEditEvent] = useState<EventItem | null>(null);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // Bejelentkezett felhasználó
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  // Kijelentkezési függvény
  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('user');
    window.location.reload();
  };

  // Események lekérése a backendről
  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://localhost:7248/api/Events', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
          throw new Error(`Hiba: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('=== DEBUG: Raw events ===', data);
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
          imageUrl: `https://picsum.photos/300/200?random=${ev.id}`,
          guests: ev.guests || 0,
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

  // Szűrés
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
    const matchMyEvents = myEvents
      ? currentUser
        ? event.organizer.toLowerCase() === currentUser.fullName.toLowerCase()
        : false
      : true;
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
      matchMaxDuration &&
      matchMyEvents
    );
  });

  // Törlés (DELETE)
  const handleDelete = async (eventId: number) => {
    if (!window.confirm('Biztosan törlöd ezt az eseményt?')) return;
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`https://localhost:7248/api/Events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
      } else {
        const errorText = await response.text();
        alert('Hiba a törlés során: ' + errorText);
      }
    } catch (error) {
      console.error('Törlési hiba:', error);
    }
  };

  // Módosítás (PUT)
  const handleUpdate = async (updated: EventItem) => {
    const token = localStorage.getItem('jwtToken');
    try {
      const response = await fetch(`https://localhost:7248/api/Events/${updated.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          Id: updated.id,
          PartyName: updated.title,
          Description: updated.description,
          StartDate: updated.startDate,
          EndDate: updated.endDate,
          LocationName: updated.location,
          Address: updated.address,
          Equipment: updated.equipment,
          Guests: updated.guests,
          Theme: updated.category,
          OrganizerName: updated.organizer,
          ProviderId: 0,
          Status: 'Upcoming',
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setEvents((prev) =>
          prev.map((e) =>
            e.id === data.id
              ? {
                  id: data.id,
                  title: data.name,
                  description: data.description,
                  startDate: data.startDate,
                  endDate: data.endDate,
                  location: data.locationName,
                  address: data.address,
                  equipment: data.equipment,
                  organizer: data.organizerName,
                  category: data.theme,
                  imageUrl: e.imageUrl,
                  guests: data.guests,
                }
              : e
          )
        );
        setEditEvent(null);
      } else {
        const errorText = await response.text();
        alert('Hiba a módosítás során: ' + errorText);
      }
    } catch (error) {
      console.error('Frissítési hiba:', error);
    }
  };

  // Részletek Modal – az esemény összes adatát (beleértve a képet) megjelenítjük
  const DetailsModal: React.FC<{ event: EventItem; onClose: () => void }> = ({
    event,
    onClose,
  }) => {
    return (
      <div className="modal">
        <div className="modal-content">
          <img
            src={event.imageUrl}
            alt={event.title}
            style={{ width: '100%', marginBottom: '1rem', borderRadius: '4px' }}
          />
          <h2>{event.title}</h2>
          <p>
            <strong>Leírás:</strong> {event.description}
          </p>
          <p>
            <strong>Kezdés:</strong> {formatDateTime(event.startDate)}
          </p>
          <p>
            <strong>Befejezés:</strong> {formatDateTime(event.endDate)}
          </p>
          <p>
            <strong>Helyszín:</strong> {event.location}
            {event.address && `, ${event.address}`}
          </p>
          {event.equipment && <p><strong>Extrák:</strong> {event.equipment}</p>}
          <p>
            <strong>Vendégek száma:</strong> {event.guests}
          </p>
          <p>
            <strong>Kategória:</strong> {event.category}
          </p>
          <p>
            <strong>Szervező:</strong> {event.organizer}
          </p>
          <button onClick={onClose}>Bezár</button>
        </div>
      </div>
    );
  };

  // Szerkesztési Modal
  const EditEventModal: React.FC<{ event: EventItem; onClose: () => void }> = ({
    event,
    onClose,
  }) => {
    const [editData, setEditData] = useState<EventItem>(event);

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
      const { name, value } = e.target;
      setEditData((prev) => ({
        ...prev,
        [name]: name === 'guests' ? Number(value) : value,
      }));
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleUpdate(editData);
    };

    return (
      <div className="modal">
        <div className="modal-content">
          <h2>Esemény módosítása</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Buli neve:</label>
              <input type="text" name="title" value={editData.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Leírás:</label>
              <textarea name="description" value={editData.description} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Kezdés:</label>
              <input
                type="datetime-local"
                name="startDate"
                value={new Date(editData.startDate).toISOString().slice(0, 16)}
                onChange={(e) => {
                  const newStart = new Date(e.target.value);
                  setEditData((prev) => ({ ...prev, startDate: newStart.toISOString() }));
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>Befejezés:</label>
              <input
                type="datetime-local"
                name="endDate"
                value={new Date(editData.endDate).toISOString().slice(0, 16)}
                onChange={(e) => {
                  const newEnd = new Date(e.target.value);
                  setEditData((prev) => ({ ...prev, endDate: newEnd.toISOString() }));
                }}
                required
              />
            </div>
            <div className="form-group">
              <label>Helyszín:</label>
              <input type="text" name="location" value={editData.location} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Cím:</label>
              <input type="text" name="address" value={editData.address} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Extrák:</label>
              <input type="text" name="equipment" value={editData.equipment} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Vendégek száma:</label>
              <input type="number" name="guests" value={editData.guests} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Téma:</label>
              <input type="text" name="category" value={editData.category} onChange={handleChange} required />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                type="submit"
                style={{ backgroundColor: 'yellow', padding: '0.5rem 1rem', border: 'none', cursor: 'pointer' }}
              >
                Mentés
              </button>
              <button
                type="button"
                onClick={onClose}
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', backgroundColor: '#ccc', border: 'none' }}
              >
                Mégse
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="preloader">
        <div className="loading-bar"></div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <Navbar
        user={currentUser}
        onRegisterClick={() => setIsRegisterModalOpen(true)}
        onLogout={handleLogout}
      />

      <main className="events-main-content">
        <h1>Események</h1>
        <p>Válogass a legfrissebb események közül, vagy szűrj rá!</p>

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

          {/* Saját bulik – mindig látható */}
          <label>
            <input
              type="checkbox"
              checked={myEvents}
              onChange={(e) => setMyEvents(e.target.checked)}
            />
            Saját bulik
          </label>

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
                    {event.address && `, ${event.address}`}
                  </p>
                  {event.equipment && <p><strong>Extrák:</strong> {event.equipment}</p>}
                  <p>
                    <strong>Vendégek száma:</strong> {event.guests}
                  </p>
                  <p>
                    <strong>Kategória:</strong> {event.category}
                  </p>
                  <p>
                    <strong>Szervező:</strong> {event.organizer}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <button
                      className="btn-details details-button"
                      onClick={() => setSelectedEvent(event)}
                    >
                      Részletek
                    </button>
                    {currentUser &&
                      currentUser.fullName.toLowerCase() === event.organizer.toLowerCase() && (
                        <>
                          <button
                            className="btn-details edit-button"
                            onClick={() => setEditEvent(event)}
                          >
                            Módosítás
                          </button>
                          <button
                            className="btn-details delete-button"
                            onClick={() => handleDelete(event.id)}
                          >
                            Törlés
                          </button>
                        </>
                      )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Részletek Modal */}
      {selectedEvent && (
        <DetailsModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
      )}

      {/* Módosítás Modal */}
      {editEvent && (
        <EditEventModal event={editEvent} onClose={() => setEditEvent(null)} />
      )}

      <Footer />

      {/* Regisztrációs modal */}
      {isRegisterModalOpen && (
        <RegisterModal onClose={() => setIsRegisterModalOpen(false)} />
      )}
    </div>
  );
};

export default EventsPage;