import { View, Text, Image, ActivityIndicator, FlatList, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import SearchBar from '@/components/SearchBar';
import useFetch from '@/services/useFetch';
import { fetchAlbums, fetchArtists, fetchArtistsAlbum, Search } from '@/services/api';
import SearchTracks from '@/components/SearchTracks';
import { Link } from 'expo-router';
import SearchArtists from '@/components/SearchArtists';
import AlbumCard from '@/components/AlbumCard';
import ArtistsCard from '@/components/ArtistsCard';
import PlaylistCard from '@/components/PlaylistCard';


const search = () => {
  const [search, setSearch] = useState('')

  const { 
    data,
    loading: searchLoading,
    error: searchError,
    refetch: refetchSearch,
    reset: resetSearch
  } = useFetch(() => Search({
    query: search
  }), false)



  const [searchFinished, setSearchFinished] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (search.trim()) {
        await refetchSearch()
        setSearchFinished(true)
      }
      else {
        resetSearch()
        setSearchFinished(false)
      }
    }, 1000);

    return () => {clearTimeout(timeoutId)
                  setSearchFinished(false)}
  }, [search])

  return (
    <ScrollView className="flex-1 bg-black">
      <View className="absolute w-full z-0 h-full bg-black" />
      <Text className='text-white text-3xl mt-4 ml-7'>
        Tìm kiếm
      </Text>

      <View className="flex-1 mt-5 ml-8">
        <SearchBar
          placeholder="Tìm kiếm nhạc, tác giả,..."
          value={search}
          onChangeText={(text: string) => setSearch(text)}
        />
      </View>

      <View className="flex-1">
        {searchLoading && (
          <ActivityIndicator size="large" color="white" className="mt-10 self-center" />
        )}
        {searchError && (
          <Text className="text-white">Error: {searchError?.message}</Text>
        )}
        {!searchLoading && !searchError && search?.length > 0 && (
          <View className="mb-32">

              <View className="flex-1 mt-1 w-30 h-30">
              {searchFinished && (
                  <Text className='text-white self-center text-xl ml-5 -mb-3 mt-3'>TOP Nghệ sĩ</Text>
              )}
                <FlatList
                  scrollEnabled={false}
                  data={data?.artists?.items?.filter((item: { id: any; }) => item && item.id).slice(0, 1)}
                  renderItem={({ item }) => <SearchArtists {...item}/>}
                  keyExtractor={(item) => item.id.toString()} />

                {searchFinished && (
                  <Text className='text-white self-center text-xl ml-5 mb-3 mt-3'>Nghệ sĩ</Text>
                )}
                  <FlatList
                  scrollEnabled={false}
                  data={data?.artists?.items.slice(1, 7)}
                  renderItem={({ item }) => <ArtistsCard {...item}/>}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={2}
                  columnWrapperStyle={{
                    justifyContent: 'flex-start',
                    gap: 20,
                    marginBottom: 5,
                    marginLeft: 22
                    }} />
                </View>


            <View className="flex-1 mt-1 w-30 h-30">
            {searchFinished && (
                  <Text className='text-white self-center text-xl ml-5 mt-5'>Nhạc</Text>
            )}
              <FlatList
                scrollEnabled={false}
                data={data?.tracks?.items.filter((item: { id: any; }) => item && item.id).slice(0, 5)}
                renderItem={({ item }) => <SearchTracks {...item}/>}
                keyExtractor={(item) => item.id.toString()} />
            </View>

            <View className="flex-1 mt-1 ml-1 w-30 h-30">
              {searchFinished && (
                  <Text className='text-white self-center text-xl ml-5 mt-5 mb-2'>Albums</Text>
              )}
              <FlatList
                scrollEnabled={false}
                data={data?.albums.items.filter((item: { id: any; }) => item && item.id).slice(0, 6)}
                renderItem={({item}) => (
                  <View className="w-1/3 mb-1 mt-1"> 
                    <AlbumCard {...item} />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()} 
                numColumns={3}
                contentContainerStyle={{
                  paddingBottom: 20
                }}
                />
                
            </View>

            <View className="flex-1 mt-1 ml-1 w-30 h-30">
              {searchFinished && (
                  <Text className='text-white self-center text-xl ml-5 mt-5 mb-2'>Playlists</Text>
              )}
              <FlatList
                scrollEnabled={false}
                data={data?.playlists.items.filter((item: { id: any; }) => item && item.id).slice(0, 6)}
                renderItem={({item}) => (
                  <View className="w-1/3 mb-1 mt-1"> 
                    <PlaylistCard {...item} />
                  </View>
                )}
                keyExtractor={(item) => item.id.toString()} 
                numColumns={3}
                contentContainerStyle={{
                  paddingBottom: 20
                }}
                />
                
            </View>

          </View>
        )}
      </View>

    </ScrollView>
  );
}

export default search