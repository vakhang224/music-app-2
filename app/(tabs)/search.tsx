import { View, Text, Image } from 'react-native'
import React from 'react'
import SearchBar from '@/components/SearchBar';

const search = () => {
  return (
    <View className="flex-1">
      <View className="absolute w-full z-0 h-full bg-gray-900"/>
      <Text className='text-white text-3xl mt-4 ml-7'>
        Tìm kiếm
      </Text>

      <View className="flex-1 mt-7 ml-7">
        <SearchBar />
      </View>
    
    </View>
  );
}

export default search