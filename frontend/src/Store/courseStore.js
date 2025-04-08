import { create } from 'zustand';

export const useCourseStore = create((set) => ({
  selectedCourse: {
    id: 'intro',
    name: 'Introduction to Computer',
    path: '/learn',
  },
  setSelectedCourse: (course) => set({ selectedCourse: course }),
}));
