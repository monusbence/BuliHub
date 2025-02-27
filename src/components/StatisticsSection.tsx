import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

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

const StatisticsSection: React.FC = () => {
  const [cardsExpanded, setCardsExpanded] = useState(false);
  const section2Ref = useRef<HTMLDivElement | null>(null);

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
