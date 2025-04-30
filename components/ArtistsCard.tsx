import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import "@/app/global.css";
import { Link } from 'expo-router';

const ArtistsCard = ({id, images, name, type}: Artists) => {
  return (
    //@ts-ignore
    <Link href={`/song/${id}`} asChild>
      <TouchableOpacity
      className={`w-[45%] flex flex-row bg-[#101010] rounded-lg h-14`}>
        <Image source={{
          uri: images 
            ? `${images[0]?.url}` 
            : 'https://placeholder.co/600x400/1a1a1a/ffffff.png'
        }}
          className='w-[30%]  rounded-lg'
          resizeMode='cover'
        />
        <Text className='text-white self-center ml-3'>{name}</Text>
      </TouchableOpacity>
    </Link>
  )
}
export default ArtistsCard;