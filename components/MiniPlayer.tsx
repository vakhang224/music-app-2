// Mini player hiển thị dưới màn hình để điều khiển nhạc

import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { fetchTracks, fetchAlbumTracks } from '@/services/api';
import AntDesign from '@expo/vector-icons/AntDesign';
import Foundation from '@expo/vector-icons/Foundation';
import { usePlayerStore } from '@/store/usePlayerStore';

export default function MiniPlayer() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    pause,
    resume,
    isPlaying,
    currentTrackId,
    trackAPI
  } = usePlayerStore();

  // const [track, setTrack] = useState<any>(null);
  // const [albumTracks, setAlbumTracks] = useState<any[]>([]);

  // // Khi có bài mới -> lấy metadata và danh sách album
  // useEffect(() => {
  //   if (currentTrackId) {
  //     fetchTracks({ query: currentTrackId }).then(async (t) => {
  //       setTrack(t);
  //       if (t?.album?.id) {
  //         const data = await fetchAlbumTracks({ query: t.album.id });
  //         setAlbumTracks(data?.items || []);
  //       }
  //     });
  //   }
  // }, [currentTrackId]);

  // // Không hiện mini player ở trang chi tiết hoặc khi chưa có bài
  if (!currentTrackId || pathname?.startsWith('/song/')) return null;
  if (!trackAPI) return null;

  return (
    <View className="flex-row items-center p-2.5 bg-[#111] absolute bottom-12 left-0 right-0 mb-4 z-50">
      <TouchableOpacity
        className="flex-row items-center flex-1"
        activeOpacity={0.9}
        onPress={()=>{router.push(`/song/${currentTrackId}`)}}
        
      >
        <Image
          source={{ uri: trackAPI?.album.images[0].url }}
          className="w-10 h-10 rounded-md"
        />

        <View className="ml-2.5">
          <Text numberOfLines={1} className="text-white font-bold">
            {trackAPI?.name}
          </Text>
          <Text numberOfLines={1} className="text-gray-400 text-xs">
            {trackAPI?.artists.map((item)=>item.name).join(",")}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Nút điều khiển thu gọn */}
       <View className="flex-row items-center justify-center gap-5">
        <TouchableOpacity onPress={() =>{}}>
          <Foundation name="previous" size={20} color="white" className=""/>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => (isPlaying ? pause() : resume())}>
          <Text className="text-white text-xl ml-2">
            {isPlaying ? 
            <Foundation name="pause" size={24} color="white" />
            : <Foundation name="play" size={24} color="white" /> }
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}}>
          <Foundation name="next" size={20} color="white" className="mr-2"/>
        </TouchableOpacity>
      </View>
    </View>
  );
}
