// Tạo store với Zustand để quản lý trạng thái phát nhạc
import { create } from 'zustand';
import { Audio } from 'expo-av';
import localTracks from '@/assets/songs/localTracks';

interface PlayerState {
  currentTrackId: string | null; // ID bài hát hiện tại
  currentTrackMeta: any | null;  // Metadata bài hiện tại (tên, nghệ sĩ, ảnh...)
  isPlaying: boolean;            // Có đang phát nhạc không
  sound: Audio.Sound | null;     // Đối tượng âm thanh đang phát
  position: number;              // Vị trí hiện tại trong bài (ms)
  duration: number;              // Tổng thời gian bài (ms)

  // Các hàm điều khiển nhạc
  play: (id: string) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  playNext: (albumTracks: any[]) => Promise<void>;
  playPrev: (albumTracks: any[]) => Promise<void>;
}

// Tạo Zustand store
export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrackId: null,
  currentTrackMeta: null,
  isPlaying: false,
  sound: null,
  position: 0,
  duration: 0,

  // Phát một bài hát mới theo ID
  play: async (id: string) => {
    const { sound: oldSound } = get();

    // Nếu có bài đang phát trước đó thì dừng lại
    if (oldSound) await oldSound.unloadAsync();

    // Reset trạng thái về mặc định trước khi phát bài mới
    set({
      currentTrackId: id,
      currentTrackMeta: null,
      sound: null,
      isPlaying: false,
      position: 0,
      duration: 0,
    });

    // Tìm file nhạc local theo ID
    const track = localTracks.find(t => t.id === id);
    if (!track) {
      console.log('Không có file nhạc local cho:', id);
      return;
    }

    // Load và phát nhạc bằng expo-av
    const { sound, status } = await Audio.Sound.createAsync(track.url, { shouldPlay: true });

    // Theo dõi trạng thái phát nhạc liên tục
    sound.setOnPlaybackStatusUpdate(status => {
      if (!status.isLoaded) return;
      set({
        position: status.positionMillis,
        duration: status.durationMillis || 0,
        isPlaying: status.isPlaying,
      });
    });

    // Lưu lại thông tin vào store
    set({
      sound,
      currentTrackMeta: track,
      isPlaying: true,
    });

    console.log('Đang phát:', track.id);
  },

  // Tạm dừng phát nhạc
  pause: async () => {
    const { sound } = get();
    if (sound) {
      await sound.pauseAsync();
      set({ isPlaying: false });
    }
  },

  // Tiếp tục phát nhạc
  resume: async () => {
    const { sound } = get();
    if (sound) {
      await sound.playAsync();
      set({ isPlaying: true });
    }
  },

  // Phát bài kế tiếp trong danh sách album
  playNext: async (albumTracks: any[]) => {
    const { currentTrackId, play } = get();
    const idx = albumTracks.findIndex(t => t.id === currentTrackId);
    const nextTrack = albumTracks[idx + 1];
    if (nextTrack) {
      console.log('⏭ Qua bài:', nextTrack.name);
      await play(nextTrack.id);
    } else {
      console.log(' Không có bài tiếp theo');
    }
  },

  // Phát bài trước đó trong danh sách album
  playPrev: async (albumTracks: any[]) => {
    const { currentTrackId, play } = get();
    const idx = albumTracks.findIndex(t => t.id === currentTrackId);
    const prevTrack = albumTracks[idx - 1];
    if (prevTrack) {
      console.log('⏮ Quay lại bài:', prevTrack.name);
      await play(prevTrack.id);
    } else {
      console.log(' Không có bài trước');
    }
  },
}));
