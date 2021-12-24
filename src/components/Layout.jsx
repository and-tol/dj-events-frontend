import { useRouter } from 'next/router';
import Head from 'next/head';
import { Footer } from './Footer';
import { Header } from './Header';
import { Showcase } from './Showcase';
import styles from '@/styles/Layout.module.css';

export const Layout = ({ title, keywords, description, children }) => {
  const router = useRouter();

  return (
    <div>
      <Head>
        <title>{title}</title>
        <meta name='description' content={description} />
        <meta name='keywords' content={keywords} />
      </Head>
      <Header />

      {router.pathname === '/' && <Showcase />}

      <div className={styles.container}>{children}</div>

      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: 'DJ Events | Find hottest party',
  description: 'Find the latest DJ and other musical events',
  keywords: 'music, dj, edm, events',
};
