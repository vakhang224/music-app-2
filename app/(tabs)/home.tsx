import {
  ActivityIndicator,
  Button,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import {
  fetchArtists,
  fetchArtistsAlbum,
  fetchMultipleArtistsAlbums,
  fetchReleaseAlbum,
} from "@/services/api";
import useFetch from "@/services/useFetch";
import { FlatList } from "react-native";
import ArtistsCard from "@/components/ArtistsCard";
import AlbumCard from "@/components/AlbumCard";
import ArtistsAlbum from "@/components/ArtistsAlbum";
import { StatusBar } from "expo-status-bar";
import { ThemeContext } from '@/theme/ThemeContext';  // Import the ThemeContext
import React, { useContext } from 'react';

export default function Index() {
  // Gọi API để lấy danh sách nhiều nghệ sĩ dựa vào ID
  const { data, loading, error } = useFetch(() => fetchArtists({
    query: '2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6,5dfZ5uSmzR7VQK0udbAVpf,6mEQK9m2krja6X1cfsAjfl,1n9JKdEdLxrbgJiqz1WZFJ'
  }));
  const { data: album, loading: albumLoading, error: albumError } = useFetch(() => fetchReleaseAlbum());
  const artistIds = [
    "6mEQK9m2krja6X1cfsAjfl",
    "1vCWHaC5f2uS3yhpwWbIA6",
    "5dfZ5uSmzR7VQK0udbAVpf"
  ];
  const { data: artistalbum, loading: artistalbumLoading, error: artistalbumError } = useFetch(() => fetchMultipleArtistsAlbums(artistIds));

  const { background, text } = useContext(ThemeContext); // Consume the theme

  return (
    <View style={{backgroundColor: background}} className="flex-1 pb-14">
      <StatusBar hidden={true} />
      <ScrollView className="flex-1">

        {/* Thanh tiêu đề (header) */}
        <View className="flex flex-row justify-between items-center h-16 mt-5">
          {/* Tiêu đề Trang chủ */}
          <View className="ml-5">
            <Text style={{color: text}} className="text-3xl">Trang chủ</Text>
          </View>

          {/* Biểu tượng Thông báo và Lịch sử */}
          <View className="flex flex-row w-24 items-center justify-center">
            <TouchableOpacity className="mr-6">
              <Ionicons name="notifications" size={22} color="white" />
            </TouchableOpacity>
            <TouchableOpacity className="mr-6">
              <FontAwesome5 name="history" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section: Tác giả đề xuất */}
        <View>
          <Text style={{color: text}} className="text-xl ml-5 mt-5">Tác giả đề xuất</Text>

          {loading ? (
            // Trạng thái đang tải
            <ActivityIndicator size="large" color="white" className="mt-10 self-center" />
          ) : error ? (
            // Trạng thái lỗi
            <Text>Error: {error?.message}</Text>
          ) : (
            // Hiển thị danh sách nghệ sĩ
            <View className="flex-1 mt-5 ml-8">
              <FlatList
                scrollEnabled={false}
                data={data?.artists}
                renderItem={({ item }) => <ArtistsCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: 'flex-start',
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                  flex: 1
                }}
              />
            </View>
          )}
        </View>

        {/* Section: Album mới ra mắt */}
        <View>
          <Text style={{color: text}} className="text-xl ml-5 mt-5">Album mới ra mắt</Text>

          {albumLoading ? (
            <ActivityIndicator size="large" color="white" className="mt-10 self-center" />
          ) : albumError ? (
            <Text>Error: {albumError?.message}</Text>
          ) : (
            <View className="flex-1 mt-5 ml-2.5 mr-2.5">
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={album?.albums.items}
                renderItem={({ item }) => <AlbumCard {...item} />}
                keyExtractor={(item) => item.id.toString()}

              />
            </View>
          )}
        </View>

        {/* Section: Album của từng nghệ sĩ */}
        <View className="mb-14">
          {artistalbumLoading ? (
            <ActivityIndicator size="large" color="white" className="mt-10 self-center" />
          ) : artistalbumError ? (
            <Text>{artistalbumError?.message}</Text>
          ) : (
            <>
              {artistalbum?.map((artistAlbum, index) => {
                // Tìm tên nghệ sĩ tương ứng với album
                const artist = data?.artists.find((a: { id: string; }) => a.id === artistIds[index]);
                const artistName = artist?.name ?? "Unknown Artist";

                return (
                  <View key={artistIds[index]}>
                    {/* Tên và avatar của nghệ sĩ */}
                    <View className="flex flex-row items-center">
                      <Image source={{ uri: artist?.images[0]?.url }} className="h-10 w-10 ml-5 rounded-full mt-5" />
                      <Text style={{color: text}} className="text-xl ml-3 mt-5">Album của {artistName}</Text>
                    </View>

                    {/* Danh sách album theo chiều ngang */}
                    <View className="mt-2 ml-2.5 mr-2.5">
                      <FlatList
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        data={artistAlbum?.items}
                        renderItem={({ item }) => <ArtistsAlbum {...item} />}
                        keyExtractor={(item) => item.id.toString()}
                      />
                    </View>
                  </View>
                );
              })}
            </>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

