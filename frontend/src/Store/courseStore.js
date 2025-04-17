import { create } from 'zustand';

export const COURSES = [
  {
    id: 'intro',
    name: 'Introduction to Computer',
    backendId: 1,
    path: '/learn',
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    backendId: 2,
    path: '/learn',
  },
  {
    id: 'backend',
    name: 'Backend Development',
    backendId: 3,
    path: '/learn',
  },
];

export const useCourseStore = create((set) => ({
  selectedCourse: JSON.parse(localStorage.getItem('selectedCourse')) || null,

  setSelectedCourse: (course) => {
    localStorage.setItem('selectedCourse', JSON.stringify(course));
    set({ selectedCourse: course });
  },

  clearSelectedCourse: () => {
    localStorage.removeItem('selectedCourse');
    set({ selectedCourse: null });
  },
}));