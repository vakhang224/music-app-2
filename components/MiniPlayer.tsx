import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { usePlayerStore } from '@/store/usePlayerStore';
import { useEffect, useState } from 'react';
import { fetchTracks, fetchAlbumTracks } from '@/services/api';

export default function MiniPlayer() {
  const router = useRouter();
  const pathname = usePathname();

  const {
    currentTrackId,
    isPlaying,
    pause,
    resume,
    playNext,
    playPrev,
    play, // ✅ THÊM Ở ĐÂY
  } = usePlayerStore();

  const [track, setTrack] = useState<any>(null);
  const [albumTracks, setAlbumTracks] = useState<any[]>([]);

  useEffect(() => {
    if (currentTrackId) {
      fetchTracks({ query: currentTrackId }).then(async (t) => {
        setTrack(t);
        if (t?.album?.id) {
          const data = await fetchAlbumTracks({ query: t.album.id });
          setAlbumTracks(data?.items || []);
        }
      });
    }
  }, [currentTrackId]);

  if (!currentTrackId || pathname?.startsWith('/song/')) return null;
  if (!track) return null;

  return (
    <TouchableOpacity
      className="flex-row items-center p-2.5 bg-[#111] absolute bottom-12 left-0 right-0 mb-4 z-50"
      onPress={() => router.push(`/song/${track.id}`)} // ✅ sửa lại: mở player screen thay vì gọi `play`
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: track.album.images[0].url }}
        className="w-10 h-10 rounded-md"
      />

      <View className="flex-1 ml-2.5">
        <Text numberOfLines={1} className="text-white font-bold">
          {track.name}
        </Text>
        <Text numberOfLines={1} className="text-gray-400 text-xs">
          {track.artists[0].name}
        </Text>
      </View>

      <View className="flex-row items-center">
        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            playPrev(albumTracks);
          }}
        >
          <Text className="text-white text-base px-2">⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            isPlaying ? pause() : resume();
          }}
        >
          <Text className="text-white text-xl px-2">
            {isPlaying ? '⏸' : '▶️'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={(e) => {
            e.stopPropagation();
            playNext(albumTracks);
          }}
        >
          <Text className="text-white text-base px-2">⏭</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
