import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Layout } from '@/components/Layout';
import { EventMap } from '@/components/EventMap';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';
import Image from 'next/image';
import { ToastContainer, toast } from 'react-toastify';
import { serializeData } from '@/helpers/index';
import qs from 'qs';
import 'react-toastify/dist/ReactToastify.css';

export default function EventPage({ event }) {
  const router = useRouter();

  if (!event?.attributes?.slug) {
    console.error('Do not have slug');
  }

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
          {event.date && new Date(event.date).toLocaleDateString('en-US')} at{' '}
          {event.time}
        </span>
        <h1>{event.name}</h1>

        <ToastContainer />

        {event.image && (
          <div className={styles.image}>
            <Image
              src={`${API_URL}${event.image.large.url}`}
              width={960}
              height={600}
            />
          </div>
        )}

        <h3>Performers: </h3>
        <p>{event.performers}</p>
        <h3>Description:</h3>
        <p>{event.description}</p>
        <h3>Venue: {event.venue}</h3>
        <p>{event.address}</p>

        <EventMap event={event} />

        <Link href='/events'>
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  );
}

// ! Error occurred prerendering page "/events/[slug]". Read more: https://nextjs.org/docs/messages/prerender-error
// ! TypeError: Cannot read property 'attributes' of undefined
// ? Поэтому используем getServerSideProps и запрос на сервер по каждому слагу

// export const getStaticPaths = async () => {
//   const res = await fetch(`${API_URL}/api/events?populate=image`);
//   const { data } = await res.json();

//   const paths = data
//     ? data.map(event => ({
//         params: { slug: event.attributes.slug ?? '' },
//       }))
//     : [];

//   return {
//     paths,
//     fallback: true,
//   };
// };

// export const getStaticProps = async ({ params: { slug } }) => {
//   // const res = await fetch(`${API_URL}/api/events/${slug}`);
//   const res = await fetch(
//     `${API_URL}/api/events?populate=image&filters[slug][$eq]=${slug}`
//   );
//   const { data } = await res.json();

//   return {
//     props: {
//       event: data[0] ?? {},
//       // event: events[0],
//     },
//     revalidate: 1,
//   };
// };

export const getServerSideProps = async ({ query: { slug } }) => {
  const query = qs.stringify(
    {
      filters: {
        slug: {
          $eq: slug,
        },
      },
      populate: ['image'],
    },
    {
      encodeValuesOnly: true,
    }
  );
  const res = await fetch(`${API_URL}/api/events?${query}`);
  const { data } = await res.json();

  return {
    props: {
      event: serializeData(data)[0],
    },
  };
};
