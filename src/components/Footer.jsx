import styles from '../styles/Footer.module.css';
import { format } from 'date-fns';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className={styles.footer}>
      <p>Copyright &copy; DJEvents 2021 - {format(Date.now(), 'yyyy')}</p>
      <p>
        <Link href='/about'>About this project</Link>
      </p>
    </footer>
  );
};
