import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

const MusicCard = ({id, name, artists, images}: ) => {
  return (
    <Link href={`/songs/${id}`} asChild>
        <TouchableOpacity className='w-[30%]'>
            <Image source={{

            }}/>
        </TouchableOpacity>

    </Link>
  )
}

export default MusicCard