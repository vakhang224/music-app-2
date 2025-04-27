import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const MusicCard = ({id, name, artists, images}: Album) => {
  return (
    <Link href={`/songs/${id}`} asChild>
        <TouchableOpacity className='w-[30%]'>
            <Image source={{uri: images ? `https://i.scdn.co/image/${images}`
                                        :  `https://placeholder.co/600x400/1a1a1a/ffffff.png`}}
                                        
                    className="w-full h-52 rounded-sm"   
                    resizeMode='cover'        
            />
            <Text className="text-sm font-bold text-white mt-2">{name}</Text>
            <Text className="text-sm font-bold text-white mt-2">{artists}</Text>
        </TouchableOpacity>

    </Link>
  )
}

export default MusicCard