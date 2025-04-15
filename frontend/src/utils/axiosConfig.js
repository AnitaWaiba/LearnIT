import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
});

// ✅ Automatically attach JWT token to non-public requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    const publicPaths = ['/signup', '/login'];

    // Skip adding token for public auth routes
    const isPublic = publicPaths.some(path => config.url.includes(path));

    if (!isPublic && token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401/403 only for non-public endpoints
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    const { config, response } = error;

    const publicPaths = ['/signup', '/login'];
    const isPublic = config && publicPaths.some(path => config.url.includes(path));

    if (!isPublic && response) {
      if (response.status === 401 || response.status === 403) {
        console.warn("🔒 Session expired or forbidden. Logging out...");
        localStorage.removeItem('access_token');
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
