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

// ========== LESSONS ==========

// Fetch all lessons for a course
export const getLessonsByCourse = (course) => api.get(`/lessons/?course=${course}`);

// Fetch all questions for a lesson
export const getQuestions = (lessonId) => api.get(`/lessons/${lessonId}/questions/`);

// Fetch lesson details + questions
export const getLessonDetailsWithQuestions = (lessonId) => {
  return axios.get(`/api/lessons/${lessonId}/questions/`);
};

// Enroll in a lesson
export const enrollInLesson = (lessonId) => api.post(`/enroll/${lessonId}/`);

// Add a new question to a specific lesson
export const addQuestionToLesson = (lessonId, questionData) => {
  return api.post(`/lessons/${lessonId}/add-q/`, questionData);
};

export const getAllQuestions = async () => {
  const res = await fetch('http://localhost:8000/api/questions/', {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('access_token')}`
    }
  });
  return res.json();
};

// Fetch all questions for a specific lesson
export const fetchQuestionsByLesson = (lessonId) =>
  api.get(`/lessons/${lessonId}/questions/`);

// Update a specific question
export const updateQuestionById = (questionId, updatedData) =>
  api.put(`/questions/${questionId}/`, updatedData);

// Delete a specific question
export const deleteQuestionById = (questionId) =>
  api.delete(`/questions/${questionId}/`);

// ========== QUESTS ==========
export const getDailyQuests = () => api.get('/daily-quests/');

export default api;

export const getAdminDashboard = () => api.get('/admin/dashboard/');
