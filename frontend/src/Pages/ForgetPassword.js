import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/forgot-password/', { email });
      toast.success(res?.data?.message || 'Reset email sent successfully!');
    } catch (error) {
      const msg = error?.response?.data?.error || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <ToastContainer position="top-center" />
      <h2>Forgot Password</h2>
      <p className={styles.subtitle}>
        Enter your registered email address and we’ll send you a link to reset your password.
      </p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email address</label>
        <input
          type="email"
          id="email"
          placeholder="example@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>

        <div className={styles.backLogin}>
          <span onClick={() => navigate('/login')}>← Back to Login</span>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
