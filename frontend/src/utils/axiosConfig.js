import axios from 'axios';

const PUBLIC_PATHS = ['/signup', '/login'];

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ✅ Attach JWT token to protected requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    const isPublic = PUBLIC_PATHS.some(path => config.url.includes(path)); // ✅ FIXED

    if (!isPublic && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle common auth errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config, response } = error;

    if (!config || !response) return Promise.reject(error);

    const isPublic = PUBLIC_PATHS.some(path => config.url.includes(path)); // ✅ FIXED

    if (response.status === 401 && !isPublic) {
      console.warn('🔒 Unauthorized. Logging out...');
      localStorage.removeItem('access_token');
      window.location.href = '/login';
    } else if (response.status === 403 && !isPublic) {
      console.warn("⚠️ Access denied. You don't have permission.");
      alert("You don't have permission to access this feature.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
