import React from "react";
import Navbar from "./components/navbar";
import "./App.css";

const App = () => {
  return (
    <div>
      <Navbar />
      <section className="section section1">
        <h1>Első szekció</h1>
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
