import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signupUser } from '../utils/api';
import styles from './Signup.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const strongPasswordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (!strongPasswordRegex.test(formData.password)) {
      toast.error('Password must be at least 8 characters and include letters, numbers, and special characters.');
      return;
    }

    setLoading(true);
    try {
      await signupUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      toast.success(
        'Signup successful! Please check your email to verify your account. Redirecting to login...'
      );
      setTimeout(() => {
        navigate('/login');
      }, 4000);
    } catch (error) {
      console.error('Signup error:', error);

      // More detailed error parsing
      if (error.response) {
        const data = error.response.data;
        if (data.error) {
          toast.error(data.error);
        } else if (typeof data === 'object') {
          // If backend sends validation errors in dict form
          const messages = [];
          for (const key in data) {
            if (Array.isArray(data[key])) {
              messages.push(`${key}: ${data[key].join(', ')}`);
            } else {
              messages.push(`${key}: ${data[key]}`);
            }
          }
          toast.error(messages.join(' | '));
        } else {
          toast.error('Signup failed with server error.');
        }
      } else if (error.request) {
        toast.error('No response from server. Check your internet connection.');
      } else {
        toast.error('Unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupPage}>
      <ToastContainer position="top-center" />
      <div className={styles.signupContainer}>
        {loading ? (
          <div className={styles.loaderCenter}><div className={styles.loader}></div></div>
        ) : (
          <>
            <h1 className={styles.title}>Signup</h1>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="username" className={styles.label}>Username:</label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email:</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password" className={styles.label}>Password:</label>
                <div className={styles.passwordField}>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={`${styles.input} ${styles.inputPaddingRight}`}
                  />
                  <span className={styles.icon} onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>Confirm Password:</label>
                <div className={styles.passwordField}>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={`${styles.input} ${styles.inputPaddingRight}`}
                  />
                  <span className={styles.icon} onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
              </div>

              <button type="submit" className={styles.button}>Signup</button>
            </form>

            <p className={styles.switchForm}>
              Already have an account?{' '}
              <span onClick={() => navigate('/login')} className={styles.loginLink}>
                Login
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default Signup;
