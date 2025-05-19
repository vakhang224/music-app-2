import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Artist } from '@/interface/interfaces'
import { Link } from 'expo-router'
import { useContext } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';

const SearchArtists = ({ id, name, images}: Artist) => {
const { card, text } = useContext(ThemeContext); 

  return (
    <Link href={`/artists/${id}}`} asChild>
    <TouchableOpacity 
    style={{ backgroundColor: card }}
    className="flex-1 mt-5 ml-5 mr-5 p-5 flex flex-row justify-center items-center bg-[#101010] rounded-md">
      <Image
        source={{ uri: images?.[0]?.url}}
        className="w-16 h-16 rounded-full"
      />
      <Text style={{ color: text }} className="text-xl ml-5">
        {name}
      </Text>
    </TouchableOpacity>
  </Link>
  )
}

export default SearchArtists