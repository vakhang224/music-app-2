import { View, Text, Button, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { usePlayerStore } from '@/store/usePlayerStore';
import ProgressBar from '@/components/ProgressBar'; // Nếu bạn có thanh thời gian
import { Track as TrackApi } from '@/interface/interfaces';
import { AntDesign, Feather, FontAwesome } from '@expo/vector-icons';
import { Playlist } from '@/interface/databaseModel';
export default function Song() {
  const { id, track,playlist } = useLocalSearchParams() as unknown as { id: string; track: string;  playlist: string; };
  const parsedTrack: TrackApi = track ? JSON.parse(track) : null;
  const parsedPlaylist: TrackApi[] = playlist ? JSON.parse(playlist) : [];
  const {
    play,
    pause,
    resume,
    isPlaying,
    currentTrackId,
    currentTrackMeta,
    setPlayList,
    playNext,
    playPrev
  } = usePlayerStore();


useEffect(() => {
  if(playlist){
 setPlayList(parsedPlaylist)
  }
 
  const shouldPlay = id && parsedTrack && currentTrackId !== id;
  if (shouldPlay) {
    play(id, parsedTrack);
  }
}, []);

  return (


      <View className="flex-1 items-center bg-gray-900">
      <View className="flex-row w-full items-center h-20">
        <TouchableOpacity
          className="absolute left-7 top-7"
          onPress={() => router.back()}
        >
          <Feather name="minimize-2" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold ml-20 mt-1">
          Album: {currentTrackMeta?.album.name}
        </Text>
      </View>
      <View className='w-full flex-1 flex items-center justify-center'>
           <Image source={{uri:currentTrackMeta?.album.images[0].url}} className='w-64 h-64'/>

      {/* Tên bài hát & nghệ sĩ */}
      <Text className="text-white text-3xl font-bold text-center mt-16 max-w-[80%]">{currentTrackMeta?.name}</Text>
      <Text className="text-gray-400 text-md mb-10 mt-3">{currentTrackMeta?.artists.map((item)=>item.name).join(",")}</Text>

      {/* Thanh thời gian & slider */}
      <View className="w-full px-6 -mt-7 items-center">
       <ProgressBar/>
      </View>

      {/* Nút điều khiển phát nhạc */}
      <View className="flex-row items-center justify-center gap-10 mt-6">
        <TouchableOpacity onPress={()=>{
          playNext()
          }}>
          <Text className="text-white text-2xl">⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isPlaying ? pause : resume}
        >
          {isPlaying ? (
            <AntDesign name="pausecircleo" size={30} color="white" />
          ) : (
            <AntDesign name="play" size={30} color="white" />
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={()=>{
          playPrev()
          }}>
          <Text className="text-white text-2xl">⏭</Text>
        </TouchableOpacity>
      </View>
      </View>
   
    </View>
  );
}


