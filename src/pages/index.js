import { Layout } from '@/components/Layout';
import { EventItem } from '@/components/EventItem';
import { API_URL } from '@/config/index';
import Link from 'next/link';

import qs from 'qs';

export default function HomePage({ events }) {
  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map(event => (
        <EventItem key={event.id} event={event} />
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
  const query = qs.stringify(
    {
      sort: ['date:desc'],
      pagination: {
        page: 1,
        pageSize: 3,
      },
      populate: ['image']
    },
    {
      encodeValuesOnly: true,
    }
  );

  const res = await fetch(
    // `${API_URL}/api/events?populate=image&sort[0]=date%3Adesc&pagination[page]=1&pagination[pageSize]=3`
    `${API_URL}/api/events?${query}`
  );
  const { data } = await res.json();


  if (!data) {
    return {
      notFound: true,
    };
  }

  const serializeDataImg = data.map(d => ({
    ...d.attributes,
    id: d.id,
    image: d.attributes.image.data
    ? d.attributes.image.data.attributes.formats
    : null,
  }));

  return {
    props: { events: serializeDataImg },
    revalidate: 1,
  };
}
