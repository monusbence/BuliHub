import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

// EREDMÉNY: nem használunk interface-t, ezért töröljük az eredeti interface-t

// Az eredeti animációs config:
const leftCardVariants = {
  initial: { x: 0, opacity: 0 },
  animate: { x: -350, opacity: 1, transition: { duration: 1 } },
  exit: { x: 0, opacity: 0, transition: { duration: 1 } },
};

const rightCardVariants = {
  initial: { x: 0, opacity: 0 },
  animate: { x: 350, opacity: 1, transition: { duration: 1 } },
  exit: { x: 0, opacity: 0, transition: { duration: 1 } },
};

const centerCardVariants = {
  initial: { x: 0, opacity: 1 },
  animate: { x: 0, opacity: 1 },
};

/**
 * Ha mobil nézet: nincs motion, kártyák egymás alatt.
 * Ha nem mobil: a teljes eredeti animációs kód fut.
 */
const StatisticsSection: React.FC = () => {
  // Eredeti statek
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const section2Ref = useRef<HTMLDivElement | null>(null);

  // ÚJ: mobil nézet figyelése. Ha <= 767px, mobileMode=1, külön layout.
  const [mobileMode, setMobileMode] = useState(0);

  useEffect(() => {
    // Első ellenőrzés és a resize figyelése
    const checkWidth = () => {
      if (window.innerWidth <= 767) {
        setMobileMode(1);
      } else {
        setMobileMode(0);
      }
    };
    checkWidth();

    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
            if (!cardsExpanded) setCardsExpanded(true);
          } else {
            if (cardsExpanded) setCardsExpanded(false);
          }
        });
      },
      { threshold: 0.5 }
    );
    if (section2Ref.current) {
      observer.observe(section2Ref.current);
    }
    return () => {
      if (section2Ref.current) {
        observer.unobserve(section2Ref.current);
      }
    };
  }, [cardsExpanded]);

  // 🔹 Ha mobilMode===1: nincs motion, kártyák egymás alá
  if (mobileMode === 1) {
    return (
      <section id="section2" ref={section2Ref}>
        <div
          className="cards-container"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            marginTop: '2rem'
          }}
        >
          <div className="card left-card">
            <h2 className="gradient-number">+200</h2>
            <p>Meghirdetett esemény hetente</p>
          </div>

          <div className="card center-card">
            <h2 className="gradient-number">+500</h2>
            <p>Ellenőrzött vélemény</p>
          </div>

          <div className="card right-card">
            <h2 className="gradient-number">+1000</h2>
            <p>Eladott jegyek hetente</p>
          </div>
        </div>
      </section>
    );
  }

  // 🔹 Asztali nézet: az EREDETI, változatlan kód
  return (
    <section id="section2" ref={section2Ref}>
      <div
        className="cards-container"
        style={{
          position: 'relative',
          height: '350px',
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <motion.div
          className="card left-card"
          variants={leftCardVariants}
          initial="initial"
          animate={cardsExpanded ? 'animate' : 'initial'}
          exit="exit"
          style={{ position: 'absolute', left: 'calc(50% - 150px)', zIndex: 1 }}
        >
          <h2 className="gradient-number">+200</h2>
          <p>Meghirdetett esemény hetente</p>
        </motion.div>

        <motion.div
          className="card center-card"
          variants={centerCardVariants}
          initial="initial"
          animate="animate"
          style={{ position: 'absolute', left: 'calc(50% - 150px)', zIndex: 2 }}
        >
          <h2 className="gradient-number">+500</h2>
          <p>Ellenőrzött vélemény</p>
        </motion.div>

        <motion.div
          className="card right-card"
          variants={rightCardVariants}
          initial="initial"
          animate={cardsExpanded ? 'animate' : 'initial'}
          exit="exit"
          style={{ position: 'absolute', left: 'calc(50% - 150px)', zIndex: 1 }}
        >
          <h2 className="gradient-number">+1000</h2>
          <p>Eladott jegyek hetente</p>
        </motion.div>
      </div>
    </section>
  );
};

export default StatisticsSection;
