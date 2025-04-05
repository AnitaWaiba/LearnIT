import { create } from 'zustand';

export const useProfileStore = create((set) => ({
  courses: [],
  setCourses: (data) => set({ courses: data }),
}));