import { View, Text, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { fetchAlbums, fetchArtists } from '@/services/api';
import useFetch from '@/services/useFetch';
import Foundation from '@expo/vector-icons/Foundation';

const AlbumDetail = () => {
  const { id } = useLocalSearchParams();  // Lấy id album từ URL

  // Sử dụng useFetch để fetch album dựa trên id
  const { data: albums, loading: albumsLoading } = useFetch(() => fetchAlbums(id as string), true);
  const [artists, setArtists] = useState<any>(null);
  const [artistLoading, setArtistLoading] = useState(false);

  // Fetch dữ liệu nghệ sĩ khi album đã có
  useEffect(() => {
    const fetchArtistData = async () => {
      if (albums?.artists?.[0]?.id) {
        try {
          setArtistLoading(true);
          const data = await fetchArtists({ query: albums.artists[0].id });
          setArtists(data);
        } catch (error) {
          console.error("Error fetching artist:", error);
        } finally {
          setArtistLoading(false);
        }
      }
    };

    fetchArtistData();
  }, [albums]);  // Fetch lại khi `albums` thay đổi

  // Khi `id` thay đổi, `useEffect` sẽ gọi lại fetchAlbums để lấy dữ liệu mới
  useEffect(() => {
    if (id) {
      // Trigger fetch lại album khi `id` thay đổi
      fetchAlbums(id as string);
    }
  }, [id]);  // Chạy lại mỗi khi `id` thay đổi

  return (
    <View className="bg-black flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View className="bg-[#191919] overflow-hidden pb-5">
          <Image
            source={{ uri: `${albums?.images[0]?.url}` }} className="w-full h-[250px] justify-self-center" resizeMode="cover"
          />
          <Text className="text-white text-2xl text-center mt-5">{albums?.name}</Text>
        </View>

        <View className="mt-5 ml-5 flex flex-row justify-between items-center">
          <View className="flex-row">
            <Image source={{ uri: artists?.artists?.[0]?.images?.[0]?.url }} className="h-16 w-16 rounded-full" />
            <Text className="text-white self-center ml-5 text-xl">Album của {albums?.artists[0].name}</Text>
          </View>
          <TouchableOpacity className="items-center rounded-full border-white border-2 px-4 py-2.5 mr-10">
            <Foundation name="play" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AlbumDetail;
