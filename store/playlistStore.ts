import { create } from 'zustand';

type PlaylistStore = {
  shouldReload: boolean;
  triggerReload: () => void;
  resetReload: () => void;
};

export const usePlaylistStore = create<PlaylistStore>((set) => ({
  shouldReload: false,
  triggerReload: () => set({ shouldReload: true }),
  resetReload: () => set({ shouldReload: false }),
}));
