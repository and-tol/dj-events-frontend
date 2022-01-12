import qs from 'qs';
import { Layout } from '@/components/Layout';
import { EventItem } from '@/components/EventItem';
import { Pagination } from '@/components/Pagination';
import { API_URL, PER_PAGE } from '@/config/index';

export default function EventsPage({ events, page, total }) {
  return (
    <Layout>
      <h1>Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}
      {events.map(event => (
        <EventItem key={event.id} event={event} />
      ))}

      <Pagination page={page} total={total} />
    </Layout>
  );
}

export async function getServerSideProps({ query: { page = 1 } }) {
  // Calculate start page
  const start = Number(page) === 1 ? 0 : (Number(page) - 1) * PER_PAGE;

  const queryFetching = qs.stringify(
    {
      pagination: {
        start: start,
        limit: PER_PAGE,
      },
      populate: 'image',
    },
    {
      encodeValuesOnly: true,
    }
  );

  // Fetch events
  const res = await fetch(`${API_URL}/api/events?${queryFetching}`);
  const { data, meta } = await res.json();

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
    props: {
      events: serializeDataImg,
      page: Number(page),
      total: meta.pagination.total,
    },
  };
}

// export async function getStaticProps() {
//    const res = await fetch(`${API_URL}/api/events?populate=image`);
//    const { data } = await res.json();

//   if (!data) {
//     return {
//       notFound: true,
//     };
//   }

//   return {
//     props: { events: data },
//     revalidate: 1,
//   };
// }
