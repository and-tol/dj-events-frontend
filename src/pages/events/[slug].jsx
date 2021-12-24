import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { Layout } from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';
import Image from 'next/image';

export default function EventPage({ event }) {
  const deleteEvent = e => {
    console.log('delete');
  };

  const event_images = event.attributes.image.data.attributes.formats;

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${event.id}`}>
            <a>
              <FaPencilAlt /> Edit event
            </a>
          </Link>
          <a href='#' className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete event
          </a>
        </div>
        <span>
          {new Date(event.attributes.data).toLocaleDateString('en-US')} at{' '}
          {event.attributes.time}
        </span>
        <h1>{event.attributes.name}</h1>
        {event.attributes.image && (
          <div className={styles.image}>
            <Image
              src={`${API_URL}${event_images.large.url}`}
              width={960}
              height={600}
            />
          </div>
        )}

        <h3>Performers: </h3>
        <p>{event.attributes.performers}</p>
        <h3>Description:</h3>
        <p>{event.attributes.description}</p>
        <h3>Venue: {event.attributes.venue}</h3>
        <p>{event.attributes.address}</p>

        <Link href='/events'>
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  );
}

export const getStaticPaths = async () => {
  const res = await fetch(`${API_URL}/api/events?populate=image`);
  const { data } = await res.json();

  const paths = data.map(event => ({
    params: { slug: event.attributes.slug },
  }));

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps = async ({ params: { slug } }) => {
  // const res = await fetch(`${API_URL}/api/events/${slug}`);
  const res = await fetch(
    `${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=image`
  );
  const { data } = await res.json();

  return {
    props: {
      event: data[0],
      // event: events[0],
    },
    revalidate: 1,
  };
};
// export const getServerSideProps = async ({ query:{slug} }) => {
//   const res = await fetch(`${API_URL}/api/events/${slug}`);
//   const events = await res.json();

//   return {
//     props: {
//       event: events[0],
//     },
//   };
// };
