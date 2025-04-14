import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import styles from './Login.module.css';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'user' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/login/', {
        username: formData.username,
        password: formData.password,
      });

      console.log("🔐 Login response:", response.data);
      
      const { access, refresh } = response.data;

      if (access && refresh) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        toast.success('Login successful!');
        setTimeout(() => {
          if (formData.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/option');
          }
        }, 1500);
      } else {
        toast.error('Unexpected server response. Please try again.');
      }
    } catch (error) {
      const errorMsg = error?.response?.data?.error || 'Invalid credentials';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <ToastContainer position="top-center" />
      <div className={styles.loginContainer}>
        <h1 className={styles.loginTitle}>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            placeholder="Enter username or email"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label htmlFor="password">Password</label>
          <div className={styles.passwordInputContainer}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <span
              className={styles.passwordToggleIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          <label htmlFor="role">Login As</label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className={styles.dropdown}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <div className={styles.forgotPassword}>
            <a href="/forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? <div className={styles.loader}></div> : 'Login'}
          </button>

          <div className={styles.signupLink}>
            Not a Member? <span onClick={() => navigate('/signup')}>Signup</span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
