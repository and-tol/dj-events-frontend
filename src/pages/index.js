import { Layout } from '@/components/Layout';
import { EventItem } from '@/components/EventItem';
import { API_URL } from '@/config/index';
import Link from 'next/link';

export default function HomePage({ events }) {
  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map(event => (
        <EventItem key={event.id} event={event.attributes} />
      ))}
      {events.length > 0 && (
        <Link href='/events'>
          <a className='btn-secondary'>View All events</a>
        </Link>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  // const res = await fetch(`http://localhost:3002/api/events`);

  const res = await fetch(
    `${API_URL}/api/events?populate=image&sort[0]=data%3Aasc&pagination[limit]=3`
  );
  const { data } = await res.json();

  console.log('res', res);
  console.log('data', data);

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { events: data },
    // props: { events: data.slice(0, 3) },
    revalidate: 1,
  };
}
