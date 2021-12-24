import { Layout } from '@/components/Layout';
import { EventItem } from '@/components/EventItem';
import { API_URL } from '@/config/index';

export default function EventsPage({ events }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map(event => (
        <EventItem key={event.id} event={event.attributes} />
      ))}
    </Layout>
  );
}

export async function getStaticProps() {
   const res = await fetch(`${API_URL}/api/events?populate=image`);
   const { data } = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { events: data },
    revalidate: 1,
  };
}
