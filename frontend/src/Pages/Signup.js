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
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await signupUser({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });

      toast.success('Signup successful! Redirecting...');
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (error) {
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Signup failed. Please try again.');
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
