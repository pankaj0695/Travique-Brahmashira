import React from 'react';
import styles from './WhyChoose.module.css';
import { FaRobot, FaRegClock, FaWallet } from 'react-icons/fa';

const WhyChoose = () => {
  return (
    <section className={styles.whyChoose}>
      <h2 className={styles.title}>Why Choose TravelBuddy?</h2>
      <div className={styles.cards}>
        <div className={styles.card}>
          <div className={styles.icon}><FaRobot /></div>
          <h3>Exclusive plans with list of Local Events</h3>
          <p>Smart recommendations that help you make most of your trip and explore the region .</p>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}><FaRegClock /></div>
          <h3>Time-Saving</h3>
          <p>From Hotels, meals, events, sightseeing to the most amazing travel spots, get itineraries planned in just minutes.</p>
        </div>
        <div className={styles.card}>
          <div className={styles.icon}><FaWallet /></div>
          <h3>Budget-Friendly</h3>
          <p>Plans that fit your budget without compromising quality.</p>
        </div>
      </div>
    </section>
  );
};

export default WhyChoose; 