import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // Adjust if deploying elsewhere
});

// ✅ Automatically attach access token to private requests only
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');

    // Skip token for public routes
    const isPublicRoute = config.url.includes('/signup') || config.url.includes('/login');

    if (token && !isPublicRoute) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('🛡️ Token added to request:', token);
    } else if (isPublicRoute) {
      console.log('🟢 Public route, no token attached:', config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ========== AUTH ==========
export const loginUser = (credentials) => api.post('/login/', credentials);
export const signupUser = (data) => api.post('/signup/', data);
export const logoutUser = () => api.post('/logout/'); // If implemented

// ========== PROFILE ==========
export const getProfile = () => api.get('/profile/');
export const updateProfile = (data) => api.put('/profile/', data);

// ========== ADMIN ==========
export const getAllUsers = () => api.get('/users/');
export const deleteUser = (userId) => api.delete(`/users/${userId}/`);
export const updateUser = (userId, data) => api.put(`/users/${userId}/`, data);

// ========== CONTACT ==========
export const sendMessage = (formData) => api.post('/contact/', formData);

// ========== COURSE (optional) ==========
export const getCourseDetails = (slug) => api.get(`/courses/${slug}/`);

// ========== QUESTS ==========
export const getDailyQuests = () => api.get('/daily-quests/');

export default api;
