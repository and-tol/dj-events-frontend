import { FaUser } from 'react-icons/fa';
import { useEffect, useContext, useReducer } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '@/context/AuthContext';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Layout } from '@/components/Layout';
import styles from '@/styles/AuthForm.module.css';

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { login, error } = useContext(AuthContext);

  useEffect(() => { error && toast.error(error) },[error])

  const onSubmit = data => {
    login({...data})
  };

  return (
    <Layout title='User Login'>
      <div className={styles.auth}>
        <h1>
          <FaUser /> Log In
        </h1>
        <ToastContainer />
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='email'>Email Address</label>
            <input
              type='email'
              id='email'
              defaultValue=''
              {...register('email')}
            />
          </div>
          <div>
            <label htmlFor='password'>Password</label>
            <input
              type='password'
              id='password'
              defaultValue=''
              {...register('password')}
            />
          </div>
          <input type='submit' value='Login' className='btn' />
        </form>
        <p>
          Don't have an account? <Link href='/account/register'>Register</Link>
        </p>
      </div>
    </Layout>
  );
}
