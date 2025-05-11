import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Track } from '@/interface/interfaces';
import { usePlayerStore } from '@/store/usePlayerStore';

const SearchTracks = ({ id, name, artists, duration_ms, album }: Track) => {
  const { play } = usePlayerStore(); // Thêm hook store

  const formatDuration = (ms?: number) => {
    if (!ms) return '0:00';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <TouchableOpacity
      onPress={() => play(id)}
      className="px-5 py-3 mt-2 mx-5 bg-[#191919] rounded-md justify-between flex-row"
    >
      <View className="max-w-[90%]">
        <Text className="text-white font-semibold text-base" numberOfLines={1}>{name}</Text>
        <Text className="text-gray-400 text-sm" numberOfLines={1}>
          {artists.map((a) => a.name).join(', ')} • {album.name}
        </Text>
      </View>
      <View>
        <Text className="text-gray-500">{formatDuration(duration_ms)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default SearchTracks;
