import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.brand}>
          <div className={styles.logoContainer}>
            <img src="/logo.png" alt="Travique Logo" className={styles.logoImg} />
            <h3 className={styles.logo}>Travique</h3>
          </div>
          <p>Your AI-powered travel companion for perfect itineraries tailored to you.</p>
        </div>
        <div className={styles.links}>
          <div>
            <h4>Company</h4>
            <ul>
              <li><a href="#about">About</a></li>
              <li><a href="#careers">Careers</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:contact@gmail.com">Email</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
          </div>
        </div>
      </div>
      <hr className={styles.divider} />
      <div className={styles.footerBottom}>
        <p>&copy; 2025 Travique</p>
      </div>
    </footer>
  );
};

export default Footer;