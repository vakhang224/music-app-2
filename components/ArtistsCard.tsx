import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useState, useContext } from 'react'
import "@/app/global.css";
import { Link } from 'expo-router';
import { Artist } from '@/interface/interfaces';
import { ThemeContext } from '@/theme/ThemeContext'; // Import ThemeContext

const ArtistsCard = ({ id, images, name }: Artist) => {
  const { text, card } = useContext(ThemeContext); // Access theme context

  return (
    //@ts-ignore
    <Link href={`/artists/${id}`} asChild>
      <TouchableOpacity
        style={{ backgroundColor: card }} // Apply background here
        className={`w-[45%] flex flex-row rounded-lg h-14`}
      >
        <Image source={{
          uri: images
            ? `${images[0]?.url}`
            : 'https://placeholder.co/600x400/1a1a1a/ffffff.png'
        }}
          className='w-[30%] rounded-lg'
          resizeMode='cover'
        />
        <Text style={{ color: text }} className='self-center ml-3'>{name}</Text>
      </TouchableOpacity>
    </Link>
  )
}
export default ArtistsCard;