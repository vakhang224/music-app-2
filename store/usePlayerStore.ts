import { create } from 'zustand';
import { Audio, InterruptionModeIOS, InterruptionModeAndroid } from 'expo-av';
import { Track as TrackAPI } from '@/interface/interfaces';
import { fetchTracks } from '@/services/api';
const API_URL = process.env.EXPO_PUBLIC_URL_API;


interface PlayerState {
  currentTrackId: string | null;
  currentTrackMeta: TrackAPI | null;
  isPlaying: boolean;
  sound: Audio.Sound | null;
  position: number;
  duration: number;
  trackAPI:TrackAPI|null;
  isSeeking:boolean

  play: (id: string,track:TrackAPI) => Promise<void>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  playNext: () => Promise<void>;
  seekTo: (positionMillis: number) => Promise<void>;
  playPrev: () => Promise<void>;
  setIsSeeking:(isSeeking:boolean)=>Promise<void>;
  playlist: TrackAPI[],
setPlayList: (tracks: TrackAPI[]) => void;

}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrackId: null,
  currentTrackMeta: null,
  isPlaying: false,
  sound: null,
  position: 0,
  duration: 0,
  trackAPI: null,
  isSeeking: false,playlist: [],
setPlayList: (tracks) => set({ playlist: tracks }),

  setIsSeeking: async (isSeeking: boolean) => {
    set({ isSeeking });
  },

  seekTo: async (positionMillis: number) => {
  const { sound } = get();
  if (sound) {
    await sound.setPositionAsync(positionMillis);
    set({ position: positionMillis });
  }
},

play: async (id: string, track: TrackAPI) => {
  const { sound: oldSound, currentTrackId } = get();

  if (id === currentTrackId) {
    console.log(" Bài hát hiện tại đang phát rồi, không cần phát lại");
    return;
  }

  if (oldSound) {
    try {
      await oldSound.unloadAsync();
    } catch (e) {
      console.warn("Lỗi khi dừng âm thanh cũ:", e);
    }
  }

  set({
    currentTrackId: id,
    currentTrackMeta: null,
    sound: null,
    isPlaying: false,
    position: 0,
    duration: 0,
    trackAPI: track,
  });

  try {
    const url = `${API_URL}/api/song/${id}`;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });

    const { sound } = await Audio.Sound.createAsync(
      { uri: url },
      { shouldPlay: false }
    );

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded) {
        set({
          position: status.positionMillis,
          duration: status.durationMillis || 0,
          isPlaying: status.isPlaying,
        });
      } else {
        set({
          position: 0,
          duration: 0,
          isPlaying: false,
        });
      }
    });

    await sound.playAsync(); // Phát sau khi preload

    const fakeMeta: TrackAPI = {
      ...track,
      name: `Bài hát ${track.name}`,
    };

    set({
      sound,
      currentTrackMeta: fakeMeta,
      isPlaying: true,
    });

    console.log(' Đang phát từ backend:', fakeMeta.name);
  } catch (error) {
    console.error(' Lỗi phát nhạc:', error);
  }
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

playNext: async () => {
  const { currentTrackId, playlist, play } = get();
  const idx = playlist.findIndex(t => t.id === currentTrackId);
  const nextTrack = playlist[idx + 1];
  if (nextTrack) {
    await play(nextTrack.id, nextTrack);
  }
},

playPrev: async () => {
  const { currentTrackId, playlist, play } = get();
  const idx = playlist.findIndex(t => t.id === currentTrackId);
  const prevTrack = playlist[idx - 1];
  if (prevTrack) {
    await play(prevTrack.id, prevTrack);
  }
},


}));
