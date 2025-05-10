import { View, Text, Image, ActivityIndicator, FlatList, Touchable, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link, useLocalSearchParams } from 'expo-router';
import { ScrollView } from 'react-native';

import useFetch from '@/services/useFetch';
import { fetchArtists, fetchArtistsAlbum, fetchTopTracks, Search } from '@/services/api';
import { Track } from '@/interface/interfaces';
import AlbumCard from '@/components/AlbumCard';


const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const TopTracks = ({ tracks }: { tracks: Track[] }) => {
  return (
    <FlatList
      scrollEnabled={false}
      data={tracks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Link href={`/song/${item.id}`} asChild>
          <TouchableOpacity className="flex-row items-stretch mt-2 mx-5">
            <Image
              source={{ uri: item.album.images[0].url }}
              className="w-20 h-20 rounded-md mr-1"
              resizeMode="cover"
            />
            <View className="flex-1 bg-[#191919] px-4 py-3 rounded-md justify-center">
              <View className="flex-row justify-between items-center">
                <View className="flex-1 pr-2">
                  <Text className="text-white font-semibold" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-white text-sm opacity-70" numberOfLines={1}>
                    {item.artists[0].name}
                  </Text>
                </View>
                <Text className="text-white text-sm opacity-50">
                  {formatDuration(item.duration_ms)}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Link>
      )}
    />
  );
};



const ArtistDetail = () => {



  const { id } = useLocalSearchParams<{ id: string }>();

  // Fetch artist info
  const {
    data: artist,
    loading: artistLoading,
    error: artistError,
  } = useFetch(() => fetchArtists({ query: id }), true, [id]);

  // Fetch albums
  const {
    data: artistAlbum,
    loading: artistAlbumLoading,
    error: artistAlbumError,
  } = useFetch(() => fetchArtistsAlbum({ query: id }), true, [id]);

  const {
    data: top,
    loading: topLoading,
    error: topError,
  } = useFetch(() => fetchTopTracks({ query: id }), true, [id]);

  // Fetch playlists by searching artist name

  return (
    <View className="bg-black flex-1">
      <ScrollView>
        <View className=" pb-5">
          {artistLoading && (
            <ActivityIndicator size="large" color="#ffffff" className="mt-10 self-center" />
          )}
          {artistError && (
            <Text className="text-white text-center mt-5">Có lỗi xảy ra khi tải nghệ sĩ</Text>
          )}
          {!artistLoading && !artistError && artist?.artists?.[0] && (
            <>
              <Image
                source={{ uri: artist.artists[0].images?.[0]?.url }}
                className="w-full h-[250px] bg-black opacity-50"
                resizeMode="cover"
              />
              <Text className="text-white text-8xl absolute top-[150px] ml-5 font-bold"
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}>
                {artist.artists[0].name}
              </Text>
            </>
          )}
        </View>
        <View className="flex-1">
          <Text className="text-white text-2xl font-bold ml-5">Những bài hát nổi bật nhất</Text>
          {topLoading && (
            <ActivityIndicator size="large" color="#ffffff" className="mt-10 self-center" />
          )}
          {topError && (
            <Text className="text-white text-center mt-5">Có lỗi xảy ra khi tải bài hát</Text>
          )}
          {!topLoading && !topError && top?.tracks?.length > 0 && (
            <TopTracks tracks={top?.tracks} />
          )}

        </View>
        <View>
          <Text className="text-xl color-white font-bold ml-5 mt-5">Các Album của {artistAlbum?.items?.[0].artists?.[0].name}</Text>

          {artistLoading ? (
            <ActivityIndicator size="large" color="white" className="mt-10 self-center" />
          ) : artistError ? (
            <Text>Error: {artistError?.message}</Text>
          ) : (
            <View className="flex-1 mt-5 ml-2.5 mr-2.5">
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={artistAlbum?.items}
                renderItem={({ item }) => <AlbumCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
              />
            </View>
          )}
        </View>
        <View className="p-12"/>
      </ScrollView>
    </View>
  );
};

export default ArtistDetail;
