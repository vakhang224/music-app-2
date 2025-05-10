// store/usePlayerStore.ts
import { create } from 'zustand';
import { Audio } from 'expo-av';
import localTracks from '@/assets/songs/localTracks';

interface PlayerState {
  currentTrackId: string | null;
  currentTrackMeta: any | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  position: number;
  duration: number;
  play: (id: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  playNext: (albumTracks: any[]) => Promise<void>;
  playPrev: (albumTracks: any[]) => Promise<void>;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrackId: null,
  currentTrackMeta: null,
  isPlaying: false,
  sound: null,
  position: 0,
  duration: 0,

 play: async (id: string) => {
  const { sound: oldSound } = get();

  if (oldSound) await oldSound.unloadAsync();

  // Luôn cập nhật ID để màn hình hiện đúng thông tin track
  set({
    currentTrackId: id,
    currentTrackMeta: null,
    sound: null,
    isPlaying: false,
    position: 0,
    duration: 0,
  });

  const track = localTracks.find(t => t.id === id);
  if (!track) {
    console.log('🚫 Không có file nhạc local cho:', id);
    return;
  }

  const { sound, status } = await Audio.Sound.createAsync(track.url, { shouldPlay: true });

  sound.setOnPlaybackStatusUpdate(status => {
    if (!status.isLoaded) return;
    set({
      position: status.positionMillis,
      duration: status.durationMillis || 0,
      isPlaying: status.isPlaying,
    });
  });

  set({
    sound,
    currentTrackMeta: track,
    isPlaying: true,
  });

  console.log('▶️ Đang phát:', track.id);
},


  pause: async () => {
    const { sound } = get();
    if (sound) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    }
  },

  resume: async () => {
    const { sound } = get();
    if (sound) {
      await sound.playAsync();
      set({ isPlaying: true });
    }
  },

  playNext: async (albumTracks: any[]) => {
    const { currentTrackId, play } = get();
    const idx = albumTracks.findIndex(t => t.id === currentTrackId);
    const nextTrack = albumTracks[idx + 1];
    if (nextTrack) {
      console.log('⏭ Qua bài:', nextTrack.name);
      await play(nextTrack.id);
    } else {
      console.log('⛔️ Không có bài tiếp theo');
    }
  },

  playPrev: async (albumTracks: any[]) => {
    const { currentTrackId, play } = get();
    const idx = albumTracks.findIndex(t => t.id === currentTrackId);
    const prevTrack = albumTracks[idx - 1];
    if (prevTrack) {
      console.log('⏮ Quay lại bài:', prevTrack.name);
      await play(prevTrack.id);
    } else {
      console.log('⛔️ Không có bài trước');
    }
  },
}));
