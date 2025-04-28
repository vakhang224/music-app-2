import { ActivityIndicator, Button, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { fetchArtists } from "@/services/api";
import useFetch from "@/services/useFetch";
import { FlatList } from "react-native";
import ArtistsCard from "@/components/ArtistsCard";

export default function Index() {

  const { data,
          loading,
          error,
        } = useFetch(() => fetchArtists({
    query: '2CIMQHirSU0MQqyYHq0eOx,57dN52uHvrHOxijzpIgu3E,1vCWHaC5f2uS3yhpwWbIA6,5dfZ5uSmzR7VQK0udbAVpf,6mEQK9m2krja6X1cfsAjfl,1n9JKdEdLxrbgJiqz1WZFJ'
  }))

  console.log('loading:', loading);
  console.log('error:', error);
  return (
    <View className="flex flex-col flex-1 bg-gray-900">
      {/* You have an Image component without a source. It's currently rendering a full-screen gray background. 
         Consider adding a 'source' prop to display an actual image. */}

      {/* Header Section */}
      <View className="flex flex-row justify-between items-center h-16">

        {/* Title */}
        <View className="ml-5">
          <Text className="text-3xl text-white">Trang chủ</Text>
        </View>

        {/* Icons on the right */}
        <View className="flex flex-row w-24 items-center justify-center">

          {/* Notifications Icon */}
          <TouchableOpacity className="mr-6">
            <Ionicons name="notifications" size={22} color="white" className="w-6 h-6 mr-3" />
          </TouchableOpacity>

          {/* History Icon */}
          <TouchableOpacity className="mr-6">
            <FontAwesome5 name="history" size={20} color="white" className="w-6 h-6 mr-3" />
          </TouchableOpacity>

        </View>

      </View>

      {/* Suggested Artists Section */}
      <View className="flex-1">
        <Text className="text-xl color-white ml-5 mt-5">Tác giả đề xuất</Text>

        {/* Loading State */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color="white"
            className="mt-10 self-center"
          />
        ) : error ? (
          // Error State
          <Text>Error: {error?.message}</Text>
        ) : (
          
          // Data Loaded State
          <View className="flex-1 mt-5 ml-8">
            <>
              <FlatList
                data={data?.artists}
                renderItem={({item}) => (
                  <ArtistsCard
                    {...item}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                columnWrapperStyle={{
                  justifyContent: 'flex-start',
                  gap:20,
                  paddingRight:5,
                  marginBottom:10
                }}
              />
            </>
          </View>
        )}
      </View>

      <View>
      </View>
    </View>
  );
}