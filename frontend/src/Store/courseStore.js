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
    path: '/frontend',
  },
  {
    id: 'backend',
    name: 'Backend Development',
    backendId: 3,
    path: '/backend',
  },
];

// Zustand store
export const useCourseStore = create((set) => ({
  selectedCourse: COURSES[0],
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
