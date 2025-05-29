import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useContext } from 'react'
import { Link } from 'expo-router'
import { Album } from '@/interface/interfaces'
import { ThemeContext } from '@/theme/ThemeContext'; // Import ThemeContext

const AlbumCard = ({ id, name, images, artists }: Album) => {
  const { card, text } = useContext(ThemeContext); // Use the card color from ThemeContext
  return (
    <Link href={`/album/${id}`} asChild>
      <TouchableOpacity style={{ backgroundColor: card }} className='w-40 ml-1 mr-1 rounded-md overflow-hidden'>
        <View className="w-full h-32 mb-2 rounded-b-none rounded-md overflow-hidden">
          <Image source={{
            uri: images?.[0]?.url ?? 'https://via.placeholder.com/300'
          }}
            className="h-full w-full "
            resizeMode='cover'
          />
        </View>
        <View className='flex-1 -mt-3 p-2'>
          <Text style={{ color: text }} className="text-lg" numberOfLines={1}>{name}</Text>
          <Text style={{ color: text }} className="text-sm" numberOfLines={1}>{artists[0]?.name}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  )

}

export default AlbumCard
