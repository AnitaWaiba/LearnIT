import { create } from 'zustand';
import { getProfile } from '../utils/api';

export const useProfileStore = create((set) => ({
  courses: [],
  xp: 0,
  hearts: 5,
  currentStreak: 0,

  // ✅ Called with a profile object (usually from getProfile())
  setFromProfile: (profile) =>
    set({
      courses: profile.courses ?? [],
      xp: profile.xp ?? 0,
      hearts: profile.hearts ?? 5,
      currentStreak: profile.current_streak ?? 0,
    }),

  // ✅ Auto-fetch + set
  refreshProfile: async () => {
    try {
      const data = await getProfile();
      set({
        courses: data.courses ?? [],
        xp: data.xp ?? 0,
        hearts: data.hearts ?? 5,
        currentStreak: data.current_streak ?? 0,
      });
    } catch (err) {
      console.error('⚠️ Failed to refresh profile store:', err);
    }
  },
}));
