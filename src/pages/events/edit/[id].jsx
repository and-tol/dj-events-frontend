import { parseCookies } from '@/helpers/index';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaImage } from 'react-icons/fa';
import { format } from 'date-fns';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Layout } from '@/components/Layout';
import { Modal } from '@/components/Modal';
import { ImageUpload } from '@/components/ImageUpload';
import { API_URL } from '@/config/index';
import styles from '@/styles/Form.module.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Image from 'next/image';

export default function EditEventPage({ event }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: event.name,
      performers: event.performers,
      venue: event.venue,
      address: event.address,
      date: event.date,
      time: event.time,
      description: event.description,
    },
  });

  const [imagePreview, setImagePreview] = useState(
    event.image ? event.image.thumbnail.url : null
  );

  const [showModal, setShowModal] = useState(false);

  const onSubmit = async data => {
    console.log(data);
    // Validation
    const hasEmptyFields = Object.values(data).some(element => element === '');

    if (hasEmptyFields) {
      toast.error('Please fill in all fields');
    }

    const res = await fetch(`${API_URL}/api/events/${event.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: data }),
    });

    if (!res.ok) {
      if (res.status === 403 || res.status === 401) {
        toast.error('Unauthorized.');
        return;
      }
      toast.error('Somethink went wrong. Please try again.');
    } else {
      const {
        data: { attributes: newEvent },
      } = await res.json();

      router.push(`/events/${newEvent.slug}`);
    }
  };

  const imageUploaded = async () => {
    console.info('image uploaded');
    const res = await fetch(`${API_URL}/api/events/${event.id}?populate=image`);
    const { data } = await res.json();

    setImagePreview(
      data.attributes.image.data.attributes.formats.thumbnail.url
    );

    setShowModal(false);
  };

  return (
    <Layout title='Add new event'>
      <Link href='/events'>Go Back</Link>
      <h1>Edit Event</h1>

      <ToastContainer />

      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor='name'>Event Name</label>
            <input type='text' id='name' {...register('name')} />
          </div>
          <div>
            <label htmlFor='performers'>Event Performers</label>
            <input type='text' id='performers' {...register('performers')} />
          </div>
          <div>
            <label htmlFor='venue'>Event Venue</label>
            <input type='text' id='venue' {...register('venue')} />
          </div>
          <div>
            <label htmlFor='address'>Event Address</label>
            <input type='text' id='address' {...register('address')} />
          </div>
          <div>
            <label htmlFor='date'>Event Date</label>
            <input type='date' id='date' {...register('date')} />
          </div>
          <div>
            <label htmlFor='time'>Event Time</label>
            <input type='time' id='time' {...register('time')} />
          </div>
        </div>
        <div>
          <label htmlFor='description'>Event Desctiption</label>
          <textarea type='text' id='description' {...register('description')} />
        </div>
        <input type='submit' value='Update Event' className='btn' />
      </form>

      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={`${API_URL}${imagePreview}`} height={100} width={170} />
      ) : (
        <div>
          <p>No image uploaded</p>
        </div>
      )}
      <div>
        <button onClick={() => setShowModal(true)} className='btn-secondary'>
          <FaImage /> Set Image
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload eventId={event.id} imageUploaded={imageUploaded} />
      </Modal>
    </Layout>
  );
}

export const getServerSideProps = async ctx => {
  const {
    params: { id },
    req,
  } = ctx;

  const { token } = parseCookies(req);

  const res = await fetch(`${API_URL}/api/events/${id}?populate=image`);
  const { data } = await res.json();

  // console.log('events request cookie >>>>', ctx.req.headers.cookie);
  // console.log('cookies >>>>', ctx.req.cookies);

  return {
    props: {
      event: {
        ...data.attributes,
        id: data.id,
        image: data.attributes.image.data
          ? data.attributes.image.data.attributes.formats
          : null,
      },
      token
    },
  };
};
