import React, { useState } from 'react';
import './FullPageCertifiedOrganizer.css';

const FullPageCertifiedOrganizer: React.FC = () => {
  // Form állapota
  const [formData, setFormData] = useState({
    fullName: '',
    orgName: '',
    email: '',
    phone: '',
    website: '',
    description: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Hitelesített szervezői regisztráció:', formData);
    alert('Köszönjük! A regisztrációdat rögzítettük.');

    // Form nullázása
    setFormData({
      fullName: '',
      orgName: '',
      email: '',
      phone: '',
      website: '',
      description: '',
    });
  };

  return (
    <div className="fullpage-container">
      {/* Egész oldal - felső "header" részben a cím */}
      <header className="fullpage-header">
        <h1 className="certified-title">Hitelesített szervezői regisztráció</h1>
        <p className="certified-subtitle">
          Töltsd ki az alábbi űrlapot, hogy igazolt szervezőként jelenhess meg.
        </p>
      </header>

      {/* Maga a form doboz */}
      <main className="form-wrapper">
        <form className="certified-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Teljes név</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Add meg a teljes neved"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="orgName">Szervezet / Cég neve</label>
            <input
              type="text"
              id="orgName"
              name="orgName"
              placeholder="Add meg a szervezet nevét"
              value={formData.orgName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">E-mail cím</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="pl: szervezo@valami.hu"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Telefonszám</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              placeholder="pl: +36 30 123 4567"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="website">Weboldal / Közösségi oldal</label>
            <input
              type="url"
              id="website"
              name="website"
              placeholder="pl: https://www.cegem.hu"
              value={formData.website}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Rövid bemutatkozás</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Írj néhány mondatot a szervezésről..."
              value={formData.description}
              onChange={handleChange}
            ></textarea>
          </div>

          <button type="submit" className="btn-certified">
            Regisztráció
          </button>
        </form>
      </main>

      {/* Lábléc */}
      <footer className="fullpage-footer">
        © 2025 BuliHub. Minden jog fenntartva.
      </footer>
    </div>
  );
};

export default FullPageCertifiedOrganizer;
