import { create } from 'zustand';

export const useCourseStore = create((set) => ({
  currentCourse: null,
  setCurrentCourse: (course) => set({ currentCourse: course }),
}));
