import { useLocation } from 'react-router-dom';
import styles from './Footer.module.scss';

/**
 * Footer Component
 * Displays on all pages with logo and copyright information
 */
export default function Footer() {
  const location = useLocation();
  const isScenesPage = location.pathname === '/scenes';
  const isShowcasePage = location.pathname === '/showcase';
  
  return (
    <footer className={`${styles.footer} ${isScenesPage ? styles.scenesPage : ''} ${isShowcasePage ? styles.showcasePage : ''}`}>
      <img 
        src="/assets/logo-one.svg" 
        alt="Nexus Geom Lab Logo" 
        className={styles.logo}
      />
      <span className={styles.title}>NEXUS GEOM LAB</span>
      <span className={styles.copyright}>© 2025 Pablo Cordero</span>
    </footer>
  );
}
