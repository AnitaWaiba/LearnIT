import axiosInstance from './axiosConfig';
const api = axiosInstance;

// ========== AUTH ==========
export const signupUser = (data) => api.post('/signup/', data);
export const loginUser = (credentials) => api.post('/login/', credentials);
export const logoutUser = () => {
  localStorage.removeItem('access_token');
  return Promise.resolve({ message: 'Logged out locally' });
};

// ========== PROFILE ==========
export const getProfile = () => api.get('/profile/');
export const updateProfile = (data) => api.put('/profile/update/', data);

// ========== ADMIN ==========
export const getAdminDashboard = () => api.get('/admin/dashboard/');
export const getAllUsers = () => api.get('/admin/users/');
export const createUser = (data) => api.post('/admin/users/create/', data);
export const updateUser = (userId, data) => api.put(`/admin/users/${userId}/update/`, data);
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}/delete/`);

// ========== COURSES ==========
export const getAllCourses = () => api.get('/courses/').then(res => res.data);
export const enrollInCourse = (courseId) => api.post(`/courses/${courseId}/enroll/`);
export const createCourse = (formData) => api.post('/courses/create/', formData);

// ========== LESSONS ==========
export const getLessonsByCourse = (courseId) =>
  api.get(`/courses/${courseId}/lessons/`).then(res => res.data);

export const createLesson = (data) => api.post('/lessons/create/', data);
export const updateLesson = (lessonId, data) => api.put(`/lessons/${lessonId}/update/`, data);
export const deleteLesson = (lessonId) => api.delete(`/lessons/${lessonId}/delete/`);

// ========== QUESTIONS ==========
export const getLessonDetailsWithQuestions = (lessonId) =>
  api.get(`/lessons/${lessonId}/questions/`).then(res => res.data);

export const fetchQuestionsByLesson = (lessonId) =>
  api.get(`/lessons/${lessonId}/questions/`).then(res => res.data.questions);

export const addQuestionToLesson = (lessonId, data) =>
  api.post(`/lessons/${lessonId}/add-q/`, data);

export const updateQuestionById = (questionId, data) =>
  api.put(`/questions/${questionId}/update/`, data);

export const deleteQuestionById = (questionId) =>
  api.delete(`/questions/${questionId}/delete/`);

// ========== QUESTS ==========
export const getDailyQuests = () => api.get('/daily-quests/');

export default api;
