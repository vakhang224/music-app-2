import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import localTracks from '@/assets/songs/localTracks';
import { usePlayerStore } from '@/store/usePlayerStore';
import { fetchTracks, fetchAlbumTracks } from '@/services/api';
import useFetch from '@/services/useFetch';

export default function MusicPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const {
    currentTrackId,
    isPlaying,
    play,
    pause,
    resume,
    playNext,
    playPrev,
  } = usePlayerStore();

  const localTrack = localTracks.find(t => t.id === currentTrackId);

  // Gọi play khi vừa mở màn nếu ID khác currentTrackId
  useEffect(() => {
    if (id && id !== currentTrackId) {
      play(id);
    }
  }, [id]);

  const { data: track, loading } = useFetch(
    async () => currentTrackId ? fetchTracks({ query: currentTrackId }) : null,
    !!currentTrackId,
    [currentTrackId]
  );

  const [albumTracks, setAlbumTracks] = useState<any[]>([]);

  useEffect(() => {
    if (track?.album?.id) {
      fetchAlbumTracks({ query: track.album.id }).then((data) => {
        if (data?.items) {
          setAlbumTracks(data.items);
        }
      });
    }
  }, [track?.album?.id]);

  const handlePlayNext = async () => {
    await playNext(albumTracks);
  };

  const handlePlayPrev = async () => {
    await playPrev(albumTracks);
  };

  if (loading || !track) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator color="white" size="large" />
        <Text className="text-white mt-4">Đang tải bài hát...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-black p-6">
      <TouchableOpacity
        className="absolute top-12 left-4"
        onPress={() => router.back()}
      >
        <Text className="text-white text-2xl">⬇️</Text>
      </TouchableOpacity>

      <Image
        source={{ uri: track.album.images[0].url }}
        className="w-64 h-64 rounded-2xl mb-6"
        resizeMode="cover"
      />
      <Text className="text-white text-xl font-bold text-center">{track.name}</Text>
      <Text className="text-gray-400 text-md mb-8">{track.artists[0].name}</Text>

      <View className="flex-row items-center justify-center space-x-6">
        <TouchableOpacity onPress={handlePlayPrev}>
          <Text className="text-white text-2xl">⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={localTrack ? (isPlaying ? pause : resume) : undefined}
        >
          <Text className="text-white text-3xl">
            {localTrack ? (isPlaying ? '⏸' : '▶️') : '🚫'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayNext}>
          <Text className="text-white text-2xl">⏭</Text>
        </TouchableOpacity>
      </View>

      {!localTrack && (
        <Text className="text-gray-500 mt-4 text-sm">
          (Không có file nhạc cục bộ — không thể phát)
        </Text>
      )}
    </View>
  );
}
