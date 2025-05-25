import axiosInstance from './axiosConfig';
const api = axiosInstance;

//
// ========== AUTH ==========
//
export const signupUser = (data) => api.post('/signup/', data);
export const loginUser = (credentials) => api.post('/login/', credentials);
export const logoutUser = () => {
  localStorage.removeItem('access_token');
  return Promise.resolve({ message: 'Logged out locally' });
};

//
// ========== PROFILE ==========
//
export const getProfile = () => api.get('/profile/').then(res => res.data);
export const updateProfile = (formData) =>
  api.put('/profile/update/', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

//
// ========== ADMIN ==========
//
export const getAdminDashboard = () => api.get('/admin/dashboard/').then(res => res.data);
export const getAllUsers = () => api.get('/admin/users/').then(res => res.data);
export const createUser = (data) => api.post('/admin/users/create/', data);
export const updateUser = (userId, data) => api.put(`/admin/users/${userId}/update/`, data);
export const deleteUser = (userId) => api.delete(`/admin/users/${userId}/delete/`);

//
// ========== COURSES ==========
//
export const getAllCourses = () => api.get('/courses/').then(res => res.data);
export const enrollInCourse = (courseId) => api.post(`/courses/${courseId}/enroll/`);
export const createCourse = (formData) => api.post('/courses/create/', formData);

export const setUserCourseLevel = (courseId, level) =>
  api.post('/set-course-level/', { course_id: courseId, level });

export const getUserCourseLevel = (courseId) =>
  api.get(`/get-course-level/${courseId}/`).then(res => res.data);

//
// ========== LESSONS ==========
//
export const getLessonsByCourse = (courseId) =>
  api.get(`/courses/${courseId}/lessons/`).then(res => res.data);

export const createLesson = (data) => api.post('/lessons/create/', data);
export const updateLesson = (lessonId, data) => api.put(`/lessons/${lessonId}/update/`, data);
export const deleteLesson = (lessonId) => api.delete(`/lessons/${lessonId}/delete/`);

export const getLessonBlocks = (lessonId) =>
  api.get(`/lessons/${lessonId}/blocks/`).then(res => res.data);

export const markLessonCompleted = (lessonId) =>
  api.post(`/lessons/${lessonId}/complete/`);

export const getCompletedLessonsByCourse = (courseId) =>
  api.get(`/user/completed-lessons/${courseId}/`).then(res => res.data);

//
// ========== LESSON BLOCKS ==========
//
export const addParagraphBlock = (lessonId, data) =>
  api.post(`/lessons/${lessonId}/add-block/`, data);

export const updateParagraphBlock = (blockId, data) =>
  api.put(`/blocks/${blockId}/update/`, data);

export const deleteParagraphBlock = (blockId) =>
  api.delete(`/blocks/${blockId}/delete/`);

//
// ========== QUESTIONS ==========
//
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

export const submitAnswer = (questionId, answer) =>
  api.post(`/submit-answer/${questionId}/`, { answer }).then(res => res.data);

//
// ========== QUESTS ==========
//
export const getDailyQuests = () => api.get('/daily-quests/').then(res => res.data);
export const getAllQuests = () => api.get('/admin/quests/').then(res => res.data);
export const createQuest = (data) => api.post('/admin/quests/', data).then(res => res.data);
export const deleteQuestById = (id) => api.delete(`/admin/quests/${id}/`).then(res => res.data);

//
// ========== STATUS BAR ==========
//
export const getStatusInfo = () => api.get('/status-info/').then(res => res.data);

//
// ========== LEADERBOARD =========
//
export const getLeaderboard = () =>
  api.get('/leaderboard/').then(res => res.data);

//
// ========== NOTIFICATION ==========
//
export const getNotifications = () =>
  axiosInstance.get('/notifications/').then(res => res.data);
export const markNotificationRead = (id) => axiosInstance.post(`/notifications/${id}/read/`);

export default api;
