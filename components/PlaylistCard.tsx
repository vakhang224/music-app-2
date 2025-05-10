import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Album, Playlist } from '@/interface/interfaces'

const PlaylistCard = ({id, name, images, owner}: Playlist) => {
  return (
    <Link href={`/album/${id}`} asChild>
      <TouchableOpacity className='w-40 ml-1 mr-1 bg-[#191919]  rounded-md overflow-hidden'>
        <View className="w-full h-32 mb-2 rounded-b-none rounded-md overflow-hidden">
          <Image source={{
            uri: images?.[0]?.url ?? 'https://via.placeholder.com/300'
          }}
          className="h-full w-full "
          resizeMode='cover'
          />
        </View>
        <View className='flex-1 -mt-3 p-2'>
          <Text className="text-white text-lg" numberOfLines={1}>{name}</Text>
          <Text className="text-white text-sm" numberOfLines={1}>{owner?.display_name}</Text>

        </View>
      </TouchableOpacity>
    </Link>
  )
  
}

export default PlaylistCard