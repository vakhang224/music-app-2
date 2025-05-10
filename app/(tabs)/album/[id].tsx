import { View, Text, Image, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchAlbums, fetchArtists } from '@/services/api';
import useFetch from '@/services/useFetch';
import Foundation from '@expo/vector-icons/Foundation';
import { StatusBar } from 'expo-status-bar';
import { Track } from '@/interface/interfaces';
import { Link } from 'expo-router';
import { usePlayerStore } from '@/store/usePlayerStore';

// Định nghĩa kiểu dữ liệu cho một track riêng lẻ từ AlbumTracks

type Props = {
  tracks: Track[];
  albumImage?: string;
};

// Hàm chuyển đổi thời lượng từ milliseconds sang định dạng mm:ss
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Component hiển thị danh sách các bài hát trong album

const Tracks = ({ tracks }: Props) => {
  const { play } = usePlayerStore();

  return (
    <FlatList
      scrollEnabled={false}
      data={tracks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => play(item.id)}
          className="px-5 py-3 mt-2 mx-5 bg-[#191919] rounded-md justify-between flex-row"
        >
          <View>
            <Text className="text-white">{item.name}</Text>
            <Text className="text-white">{item.artists[0].name}</Text>
          </View>
          <View>
            <Text className="text-white">{formatDuration(item.duration_ms)}</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

// Component chính hiển thị thông tin chi tiết album
const AlbumDetail = () => {
  const { id } = useLocalSearchParams(); // Lấy id album từ URL



  // Gọi API lấy dữ liệu album theo id
  const { data: albums, loading, refetch:albumsRefetch} = useFetch(() => fetchAlbums(id as string), false, [id]);

  const artistId = albums?.artists?.[0]?.id

  const {
    data: artists,
    loading: artistLoading,
    refetch: artistsRefetch
  } = useFetch(
    () => artistId ? fetchArtists({ query: artistId }) : Promise.resolve(null),
    false,
    [artistId]
  );


  // Gọi API lấy thông tin nghệ sĩ khi có dữ liệu album
  useEffect(() => {
    if (id) {
      albumsRefetch();
    }
  }, [id]);

  useEffect(() => {
    if (artistId) {
      artistsRefetch();
    }
  }, [artistId]);

  // Hiển thị loading khi chưa có dữ liệu
  if (loading || artistLoading || !albums || !artists) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <ActivityIndicator size="large" color="#ffffff" />
        <Text className="text-white mt-4">Đang tải album...</Text>
      </View>
    );
  }
  // UI chính khi đã có dữ liệu album & nghệ sĩ
  return (
    <View className="bg-black flex-1">
      <StatusBar hidden={true} />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        
        {/* Phần ảnh và tên album */}
        <View className="bg-[#191919] overflow-hidden pb-5">
          {albums?.images[0].url && (
            <Image
              source={{ uri: albums?.images?.[0]?.url }}
              className="w-full h-[250px] justify-self-center"
              resizeMode="cover"
            />
          )}
          <Text className="text-white text-2xl text-center mt-5">{albums?.name}</Text>
        </View>

        {/* Thông tin nghệ sĩ + nút phát */}
        <View className="mt-5 ml-5 flex flex-row justify-between items-center">
          <View className="flex-row">
            <Image
              source={{ uri: artists?.artists?.[0]?.images?.[0].url }}
              className="h-16 w-16 rounded-full"
            />
            <Text className="text-white self-center ml-5 text-xl">
              Album của {albums?.artists[0].name}
            </Text>
          </View>
          {/* Nút phát nhạc */}
          <TouchableOpacity className="items-center rounded-full border-white border-2 px-4 py-2.5 mr-10">
            <Foundation name="play" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Danh sách bài hát */}
        <View className="mt-5">
          <Tracks tracks={albums?.tracks.items || []} />
        </View>

      </ScrollView>
    </View>
  );
};

export default AlbumDetail;
