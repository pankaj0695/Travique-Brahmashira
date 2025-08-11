import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
      </div>
      <hr className={styles.divider} />
      <div className={styles.footerBottom}>
        <p>&copy; 2025 Travique</p>
      </div>
    </footer>
  );
};

export default Footer;