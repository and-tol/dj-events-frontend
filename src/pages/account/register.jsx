import { useEffect, useContext, useReducer } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FaUser } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AuthContext from '@/context/AuthContext';
import { Layout } from '@/components/Layout';
import styles from '@/styles/AuthForm.module.css';

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const { register: userRegister, error } = useContext(AuthContext);
  useEffect(() => {
    if (error && Array.isArray(error)) {
      error.forEach(err => toast.error(err));
    } else {
      error && toast.error(error);
    }
  }, [error]);

  const onSubmit = data => {
    if (data.password !== data.passwordConfirm) {
      toast.error('Passwords do not match!');
      return;
    }
    userRegister({ ...data });
  };

  return (
    <Layout title='User Registration'>
      <ToastContainer />
      <div className={styles.auth}>
        <h1>
          <FaUser /> Register
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor='username'>Username</label>
            <input
              type='text'
              id='username'
              defaultValue=''
              {...register('username')}
            />
          </div>
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
          <div>
            <label htmlFor='passwordConfirm'>Confirm Password</label>
            <input
              type='password'
              id='passwordConfirm'
              defaultValue=''
              {...register('passwordConfirm')}
            />
          </div>
          <input type='submit' value='Register' className='btn' />
        </form>
        <p>
          Alredy have an account? <Link href='/account/login'>Login</Link>
        </p>
      </div>
    </Layout>
  );
}
