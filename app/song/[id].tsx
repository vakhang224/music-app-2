import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import { useLocalSearchParams } from 'expo-router';
import useFetch from '@/services/useFetch';
import { fetchTracks } from '@/services/api';
import AntDesign from '@expo/vector-icons/AntDesign';



const SongPlayer = () => {
    const { id } = useLocalSearchParams<{ id: string }>();

    const {data: tracks, loading: tracksLoading, error: tracksError} = useFetch(() => fetchTracks({ query: id }));
console.log("tracks: ", tracks?.artists?.[0]?.name);
  return (
    <View className="bg-black flex-1">

      <View className="flex-row items-center pt-7 px-7 gap-8">
        <AntDesign name="shrink" size={20} color="white"/>
        <Text className="text-white text-" numberOfLines={1}>Album của bài hát: {tracks?.album?.name}</Text>
      </View>
      <Image
        source={{ uri: tracks?.album?.images?.[0].url }}
        className="w-80 h-80 rounded-full self-center mt-10"
      />
      <View className="flex-1">
        <Text className="text-white text-3xl font-bold text-center mt-10">{tracks?.name}</Text>
        <Text className="text-white text-xl font-bold text-center opacity-50">{tracks?.artists?.[0]?.name}</Text>
       <View className='w-full flex items-center bg-gray-700 rounded-full -px-5'>
        <Slider
            style={{ width: '80%', height: 40}}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#FFFFFF"
            maximumTrackTintColor="#000000"
            thumbTintColor="#FFFFFF"
          />
       </View>
      </View>
      <View>

      </View>
    </View>
  );
};

export default SongPlayer