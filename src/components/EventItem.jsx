import { API_URL } from '@/config/index';
import styles from '@/styles/EventItem.module.css';
import Image from 'next/image';
import Link from 'next/link';

export const EventItem = ({ event }) => {
  const { url: thumbnail_url } = event.image.data.attributes.formats.thumbnail;
  const { url: init_image_url } = event.image.data.attributes;

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
          {new Date(event.data).toLocaleDateString('en-US')} at {event.time}
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
