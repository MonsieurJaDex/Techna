import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { User } from '@/types/user';
import { getPersistStorageSSRSafe } from '@/store/storage';

type State = {
  token: string | null;
  user: User | null;
};

type Actions = {
  setUser: (payload: { token: string; user: User }) => void;
  logout: () => void;
};

export const useUserStore = create<State & Actions>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      setUser: ({ token, user }) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
    }),
    {
      name: 'techna.user',
      storage: createJSONStorage(() => getPersistStorageSSRSafe()),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

