import React from 'react';
import './App.css';

/* Importáljuk a telcsi.png képet a 'src' mappából */
import telcsi from './telcsi.png';

const App: React.FC = () => {
  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo">Neon Party</div>
        <ul>
          <li><a href="#section1">Rólunk</a></li>
          <li><a href="#section2">Bulik</a></li>
          <li><a href="#section3">Kapcsolat</a></li>
        </ul>
      </nav>

      {/* SECTION 1 */}
      <section id="section1">
        <div className="section1-content">
          <div className="text">
            <h1>Üdv a Neon Party Keresőn!</h1>
            <p>Találd meg a legjobb bulikat a városban!</p>
          </div>
          {/* A lebegő kép jobb oldalon */}
          <img 
            src={telcsi} 
            alt="Lebegő telefon" 
            className="floating-image"
          />
        </div>
      </section>

      {/* SECTION 2 */}
      <section id="section2">
        <div className="cards-container">
          <div className="card">
            <h2>Neon Night</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
              Donec vel risus eget lorem efficitur varius.
            </p>
          </div>
          <div className="card">
            <h2>Electro Vibes</h2>
            <p>
              Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.
            </p>
          </div>
          <div className="card">
            <h2>Glow Party</h2>
            <p>
              Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 */}
      <section id="section3">
        <h2>Lépj kapcsolatba velünk!</h2>
        <p>Írj nekünk üzenetet, ha bármilyen kérdésed van.</p>
      </section>
    </>
  );
};

export default App;