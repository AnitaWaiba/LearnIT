import axios from 'axios';
import axiosInstance from './axiosConfig';

const api = axiosInstance;

// ✅ Automatically attach access token (with debug logs)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    const isPublicRoute = ['/signup', '/login'].some((route) => config.url.includes(route));

    if (token && !isPublicRoute) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('🛡️ Token attached:', token);
    } else if (isPublicRoute) {
      console.log('🟢 Public route, no token needed:', config.url);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

//
// ========== AUTH ==========
export const loginUser = (credentials) => api.post('/login/', credentials);
export const signupUser = (data) => api.post('/signup/', data);
export const logoutUser = () => {
  localStorage.removeItem('access_token');
  return Promise.resolve({ message: 'Logged out locally' });
};

//
// ========== PROFILE ==========
export const getProfile = () => api.get('/profile/');
export const updateProfile = (data) => api.put('/profile/update/', data);

//
// ========== ADMIN ==========
export const getAdminDashboard = () => api.get('/admin/dashboard/');
export const getAllUsers = () => api.get('/admin/users/');
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}/delete/`);
export const updateUser = (userId, data) => api.put(`/admin/users/${userId}/update/`, data);

//
// ========== CONTACT ==========
export const sendMessage = (formData) => api.post('/contact/', formData); // Make sure this endpoint exists

//
// ========== COURSES ==========
export const getAllCourses = () => api.get('/courses/');
export const enrollInCourse = (courseId) =>
  api.post(`/courses/${courseId}/enroll/`);
export const createCourse = (formData) => api.post('/courses/create/', formData);

//
// ========== LESSONS ==========
export const getLessonsByCourse = (courseId) => api.get(`/lessons/by-course/${courseId}/`);
export const getAllLessons = () => api.get('/lessons/');
export const createLesson = (formData) => api.post('/lessons/create/', formData);

// ✅ Lesson detail + questions combined
export const getLessonDetailsWithQuestions = (lessonId) =>
  api.get(`/lessons/${lessonId}/questions/`);

//
// ========== QUESTIONS ==========
export const addQuestionToLesson = (lessonId, data) =>
  api.post(`/lessons/${lessonId}/add-q/`, data);

export const updateQuestionById = (questionId, data) =>
  api.put(`/questions/${questionId}/update/`, data);

export const deleteQuestionById = (questionId) =>
  api.delete(`/questions/${questionId}/delete/`);

// ✅ All questions for a lesson
export const fetchQuestionsByLesson = (lessonId) =>
  api.get(`/lessons/${lessonId}/questions/`);

// ✅ All questions for a course (NEW – if you implement it on backend)
export const fetchQuestionsByCourse = (courseId) =>
  api.get(`/courses/${courseId}/questions/`); // Make sure to add this endpoint

//
// ========== QUESTS ==========
export const getDailyQuests = () => api.get('/daily-quests/');

//
// ========== EXPORT DEFAULT ==========
export default api;
