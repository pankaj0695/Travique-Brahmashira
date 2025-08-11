import React from 'react';
import styles from './Hero.module.css';
import Hero3D from './Hero3D';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../UserContext';

const Hero = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/plan');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className={styles.hero}>
      <div className={styles.canvasWrap}>
        <Hero3D />
      </div>
      <div className={styles.heroContent}>
        <h1 className={styles.title}>Plan Smart.</h1>
        <h1 className={styles.title}>Travel Smarter.</h1>
        <button className={styles.getStartedBtn} onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
};

export default Hero; 