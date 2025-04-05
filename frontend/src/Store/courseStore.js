import { create } from 'zustand';

export const useCourseStore = create((set) => ({
  selectedCourse: 'intro', // default
  setCourse: (course) => set({ selectedCourse: course }),
}));