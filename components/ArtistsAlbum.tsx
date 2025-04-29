import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const ArtistsAlbum = ({ id, name, images }: ArtistsAlbum) => {
  return (
    <Link href={`/album/${id}`} asChild>
      <TouchableOpacity className="w-32 ml-2.5 mr-2.5 mt-3">
        <View className="w-full h-32 mb-2 rounded-md overflow-hidden">
          <Image
            source={{
              uri: images[0]?.url ?? 'https://via.placeholder.com/300'
            }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
        <Text className="text-white text-sm" numberOfLines={1}>
          {name}
        </Text>
      </TouchableOpacity>
    </Link>
  );
};


export default ArtistsAlbum