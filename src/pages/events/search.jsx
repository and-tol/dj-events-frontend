import qs from 'qs';
import { Layout } from '@/components/Layout';
import { EventItem } from '@/components/EventItem';
import { API_URL } from '@/config/index';

export default function SearchPage({ events }) {
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

export async function getServerSideProps({ query: { term } }) {
  const query = qs.stringify(
    {
      filters: {
        $or: [
          { name: { $containsi: term } },
          { performers: { $containsi: term } },
          { description: { $containsi: term } },
          { venue: { $containsi: term } },
        ],
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const res = await fetch(
    // `${API_URL}/api/events?populate=image&filters[name][$containsi]=${term}`
    `${API_URL}/api/events?populate=image&${query}`
  );
  const { data } = await res.json();

  if (!data) {
    return {
      notFound: true,
    };
  }

  return {
    props: { events: data },
  };
}
