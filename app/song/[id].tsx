import { View, Text, Image, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import localTracks from '@/assets/songs/localTracks';
import { usePlayerStore } from '@/store/usePlayerStore';
import { fetchTracks, fetchAlbumTracks } from '@/services/api';
import useFetch from '@/services/useFetch';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Slider from '@react-native-community/slider';

export default function MusicPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>(); // Lấy id bài hát từ route param
  const router = useRouter(); // Dùng để điều hướng quay lại

  // Quản lý thời lượng bài hát và trạng thái thanh slider
  const [duration, setDuration] = useState(1);
  const [sliderValue, setSliderValue] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);

  // Animated Value để sync slider mượt mà
  const animatedPosition = useRef(new Animated.Value(0)).current;

  // Lắng nghe thay đổi animatedPosition và cập nhật sliderValue (nếu không đang kéo)
  useEffect(() => {
    const id = animatedPosition.addListener(({ value }) => {
      if (!isSeeking) {
        setSliderValue(value);
      }
    });

    return () => {
      animatedPosition.removeListener(id);
    };
  }, [isSeeking]);

  // Cập nhật vị trí hiện tại và tổng thời lượng từ sound mỗi 500ms
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const update = async () => {
      const sound = usePlayerStore.getState().sound;
      if (sound && !isSeeking) {
        const status = await sound.getStatusAsync();
        if (status.isLoaded) {
          animatedPosition.setValue(status.positionMillis || 0);
          setDuration(status.durationMillis || 1);
        }
      }
      timeout = setTimeout(update, 500);
    };

    update();

    return () => clearTimeout(timeout);
  }, [isSeeking]);

  // Chuyển đổi millis -> mm:ss
  function millisToMinutesAndSeconds(millis: number) {
    const minutes = Math.floor(millis / 60000);
    const seconds = Math.floor((millis % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  // Lấy dữ liệu từ Zustand store
  const {
    currentTrackId,
    isPlaying,
    play,
    pause,
    resume,
    playNext,
    playPrev,
    sound
  } = usePlayerStore();

  const localTrack = localTracks.find(t => t.id === currentTrackId); // Tìm track local tương ứng

  // Nếu ID trên URL thay đổi, phát bài mới
  useEffect(() => {
    if (id && id !== currentTrackId) {
      play(id);
    }
  }, [id]);

  // Gọi API lấy thông tin bài hát từ Spotify
  const { data: track, loading } = useFetch(
    async () => currentTrackId ? fetchTracks({ query: currentTrackId }) : null,
    !!currentTrackId,
    [currentTrackId]
  );

  // Gọi API lấy danh sách bài trong album
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

  // Hàm chuyển bài kế tiếp
  const handlePlayNext = async () => {
    await playNext(albumTracks);
  };

  // Hàm chuyển bài trước đó
  const handlePlayPrev = async () => {
    await playPrev(albumTracks);
  };

  // Nếu đang loading bài hát
  if (loading || !track) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator color="white" size="large" />
        <Text className="text-white mt-4">Đang tải bài hát...</Text>
      </View>
    );
  }

  // Giao diện phát nhạc
  return (
    <View className="flex-1 items-center bg-black">
      {/* Nút quay lại */}
      <View className="flex-row w-full items-center h-20">
        <TouchableOpacity
          className="absolute left-7 top-7"
          onPress={() => router.back()}
        >
          <Feather name="minimize-2" size={24} color="white" />
        </TouchableOpacity>
        <Text className="text-white font-bold ml-20 mt-1">
          Album: {track.album.name}
        </Text>
      </View>

      {/* Ảnh bài hát */}
      <Image
        source={{ uri: track.album.images[0].url }}
        className="w-80 h-80 rounded-full mt-10"
        resizeMode="cover"
      />

      {/* Tên bài hát & nghệ sĩ */}
      <Text className="text-white text-3xl font-bold text-center mt-16 max-w-[80%]">{track.name}</Text>
      <Text className="text-gray-400 text-md mb-10 mt-3">{track.artists[0].name}</Text>

      {/* Thanh thời gian & slider */}
      <View className="w-full px-6 -mt-7 items-center">
        <Slider
          style={{ width: '80%', height: 40 }}
          minimumValue={0}
          maximumValue={duration}
          value={sliderValue}
          minimumTrackTintColor="#FFFFFF"
          maximumTrackTintColor="#888888"
          thumbTintColor="#FFFFFF"
          onSlidingStart={() => {
            setIsSeeking(true);
          }}
          onValueChange={(value) => {
            setSliderValue(value);
          }}
          onSlidingComplete={async (value) => {
            setIsSeeking(false);
            await sound?.setPositionAsync(value);
            animatedPosition.setValue(value);
          }}
        />
        {/* Hiển thị thời gian hiện tại & tổng thời lượng */}
        <View className="flex-row justify-between w-full px-16 mt-1">
          <Text className="text-white text-xs">
            {millisToMinutesAndSeconds(sliderValue)}
          </Text>
          <Text className="text-white text-xs">
            {millisToMinutesAndSeconds(duration)}
          </Text>
        </View>
      </View>

      {/* Nút điều khiển phát nhạc */}
      <View className="flex-row items-center justify-center gap-10 mt-6">
        <TouchableOpacity onPress={handlePlayPrev}>
          <Text className="text-white text-2xl">⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={localTrack ? (isPlaying ? pause : resume) : undefined}
        >
          <Text className="text-white text-3xl">
            {localTrack ? (
              isPlaying
                ? <AntDesign name="pausecircleo" size={30} color="white" />
                : <AntDesign name="play" size={30} color="white" />
            ) : (
              <FontAwesome name="ban" size={30} color="white" />
            )}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePlayNext}>
          <Text className="text-white text-2xl">⏭</Text>
        </TouchableOpacity>
      </View>

      {/* Thông báo nếu không có file nhạc local */}
      {!localTrack && (
        <Text className="text-gray-500 mt-4 text-sm">
          (Không có file nhạc cục bộ — không thể phát)
        </Text>
      )}
    </View>
  );
}
