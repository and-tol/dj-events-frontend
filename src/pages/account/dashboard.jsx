import { DashboardEvent } from '@/components/DashboardEvent';
import { Layout } from '@/components/Layout';
import { API_URL } from '@/config/index';
import { parseCookies } from '@/helpers/index';
import styles from '@/styles/Dashboard.module.css';

export default function DashboardPage({ events }) {
  const deleteEvent = id => {
    console.log(id);
  };

  return (
    <Layout title='User Dashboard'>
      <div className={styles.dash}>
        <h1>Dashboard</h1>
        <h3>My Events</h3>

        {events.map(event => (
          <DashboardEvent
            key={event.id}
            event={event}
            handleDelete={deleteEvent}
          />
        ))}
      </div>
    </Layout>
  );
}

export const getServerSideProps = async ctx => {
  const { req } = ctx;
  const { token } = parseCookies(req);

  console.log('token dshboard >>>', token)

  const res = await fetch(`${API_URL}/api/events/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const { data } = await res.json();
  const events = data.map(d => ({ id: d.id, ...d.attributes }));

  return {
    props: {
      events,
    },
  };
};
