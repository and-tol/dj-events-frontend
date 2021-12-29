import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EventPage({ event }) {
  const router = useRouter();

  const deleteEvent = async e => {
    if (confirm('Are you sure you want to delete?')) {
      const res = await fetch(`${API_URL}/api/events/${event.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push(`/events`);
      }
    }
  };

  const event_images = event.attributes.image.data
    ? event.attributes.image.data.attributes.formats
    : null;

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
          {event.attributes.date &&
            new Date(event.attributes.date).toLocaleDateString('en-US')}{' '}
          at {event.attributes.time}
        </span>
        <h1>{event.attributes.name}</h1>

        <ToastContainer />

        {event.attributes.image.data && (
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
    `${API_URL}/api/events?populate=image&filters[slug][$eq]=${slug}`
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
