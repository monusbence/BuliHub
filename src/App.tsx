import React from "react";
import Navbar from "./components/navbar";
import "./App.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <section className="section section1">  
  <div className="content">
    <h1>Your party map</h1>
    <p>Go wild in the city, compete with other partygoers, and enjoy the nightlife wherever you are!</p>
    <div className="cta-buttons">
      <a href="#google-play">Get it on Google Play</a>
      <a href="#app-store">Download on the App Store</a>
      <a href="#app-gallery">Explore it on AppGallery</a>
    </div>
  </div>
</section>
      <section className="section section2">
        <div className="cards-container">
          <div className="card">Kártya 1</div>
          <div className="card">Kártya 2</div>
          <div className="card">Kártya 3</div>
        </div>
      </section>
      <section className="section section3">
        <h1>Harmadik szekció</h1>
      </section>
    </div>
  );
};

export default App;
