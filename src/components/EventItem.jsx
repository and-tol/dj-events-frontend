import { API_URL } from '@/config/index';
import styles from '@/styles/EventItem.module.css';
import Image from 'next/image';
import Link from 'next/link';

export const EventItem = ({ event }) => {
  const thumbnail_url = event.image.data
    ? event.image.data.attributes.formats.thumbnail.url
    : null;

  return (
    <div className={styles.event}>
      <div className={styles.img}>
        <Image
          src={
            thumbnail_url
              ? `${API_URL}${thumbnail_url}`
              : '/images/event-default.png'
          }
          width={170}
          height={100}
        />
      </div>
      <div className={styles.info}>
        <span>
          {event.date && new Date(event.date).toLocaleDateString('en-US')} at{' '}
          {event.time && event.time}
        </span>
        <h3>{event.name}</h3>
      </div>
      <div className={styles.link}>
        <Link href={`/events/${event.slug}`}>
          <a className='btn'>Details</a>
        </Link>
      </div>
    </div>
  );
};
