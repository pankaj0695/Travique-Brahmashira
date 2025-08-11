import React from 'react';
import styles from './HowItWorks.module.css';
import { FaUserEdit, FaBuilding, FaRegSave } from 'react-icons/fa'; // Changed FaRobot to FaBuilding

const HowItWorks = () => {
  return (
    <section className={styles.howItWorks}>
      <h2 className={styles.title}>How It Works</h2>
      <p className={styles.subtitle}>Three simple steps to create your perfect travel itinerary</p>
      <div className={styles.steps}>
        <div className={styles.step}>
          <div className={styles.icon}><FaUserEdit /></div>
          <h3>1. Enter Your Details</h3>
          <p>Share your destinantion of choice, budget, and trip duration and get ready to be amazed by the Itinerary.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.icon}><FaBuilding /></div> {/* Changed icon here */}
          <h3>2. Get Personalised Travel Plan </h3>
          <p>Got your bags packed? We've got you covered with a tailored itinerary just for you.</p>
        </div>
        <div className={styles.step}>
          <div className={styles.icon}><FaRegSave /></div>
          <h3>3. Customize, Save & Share</h3>
          <p>Review, customize, save or even share your personalized plan with your loved ones- ANYWHERE, ANYTIME.</p>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;