import React, { useState, useEffect } from 'react';

interface CreateEventFormProps {
  user?: { fullName: string } | null;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ user }) => {
  const [formData, setFormData] = useState({
    partyName: '',
    date: '',
    time: '',
    locationName: '',
    address: '',
    equipment: '',
    guests: '',
    theme: '',
    description: '',
  });

  // ÚJ: Figyeljük az ablakméretet, hogy mobil nézetben (<= 767px) ne jelenjen meg a kép
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };
    // Első hívás a komponens betöltésekor
    handleResize();
    // Eseményfigyelő ablakméret változásra
    window.addEventListener('resize', handleResize);
    // Takarítás
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert('Jelentkezz be, hogy létrehozhass egy bulit!');
      return;
    }

    if (!formData.date || !formData.time) {
      alert('Kérlek, add meg a dátumot és az időpontot!');
      return;
    }

    const eventData = {
      partyName: formData.partyName,
      date: formData.date,
      time: formData.time,
      locationName: formData.locationName,
      address: formData.address,
      equipment: formData.equipment,
      guests: parseInt(formData.guests, 10),
      theme: formData.theme,
      description: formData.description,
    };

    const token = localStorage.getItem('jwtToken');

    try {
      const response = await fetch('https://localhost:7248/api/Events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert('Hiba történt az esemény létrehozása során: ' + errorText);
      } else {
        alert('Esemény sikeresen létrehozva!');
      }
    } catch (error) {
      console.error('Hiba az esemény létrehozása során:', error);
      alert('Hiba történt az esemény létrehozása során');
    }

    setFormData({
      partyName: '',
      date: '',
      time: '',
      locationName: '',
      address: '',
      equipment: '',
      guests: '',
      theme: '',
      description: '',
    });
  };

  return (
    <section id="section3">
      <div className="section3-content">
        <div className="left-side">
          <h2>Hozz létre egy bulit!</h2>
          <p>Töltsd ki az alábbi űrlapot a buli részleteivel.</p>

          <form className="party-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="partyName">Buli neve</label>
              <input
                type="text"
                id="partyName"
                name="partyName"
                placeholder="Add meg a buli nevét"
                value={formData.partyName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="date">Dátum</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Időpont</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="locationName">Helyszín</label>
              <input
                type="text"
                id="locationName"
                name="locationName"
                placeholder="Add meg a helyszínt"
                value={formData.locationName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Cím</label>
              <input
                type="text"
                id="address"
                name="address"
                placeholder="Cím"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="equipment">Extrák</label>
              <input
                type="text"
                id="equipment"
                name="equipment"
                placeholder="Helyszíni extrák"
                value={formData.equipment}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="guests">Vendégek száma</label>
              <input
                type="number"
                id="guests"
                name="guests"
                min="1"
                placeholder="Hány vendéget vársz?"
                value={formData.guests}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="theme">Téma</label>
              <select
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleInputChange}
                required
              >
                <option value="">Válassz egy témát</option>
                <option value="retro">Retro</option>
                <option value="techno">Techno</option>
                <option value="hiphop">Hip-Hop</option>
                <option value="others">Egyéb</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="description">Leírás</label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Írj egy rövid leírást a buliról..."
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <button type="submit" className="btn submit-btn">
              Buli létrehozása
            </button>
          </form>
        </div>

        {/* A kép csak akkor jelenik meg, ha NEM mobil nézet */}
        {!isMobile && (
          <div className="right-side">
            <img
              src="./kepek_jegyzetek/létrehozoskép.png"
              alt="party-pic"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default CreateEventForm;
