import { View, Text, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native'
import { Track } from '@/interface/interfaces'



const SearchTracks = ({ name, artists, duration_ms, album }: Track) => {
    // Format duration from milliseconds to mm:ss
    const formatDuration = (ms?: number) => {
      if (!ms) return '0:00'
      const minutes = Math.floor(ms / 60000)
      const seconds = Math.floor((ms % 60000) / 1000)
      return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }
  
    return (
      <TouchableOpacity className="px-5 py-3 mt-2 mx-5 bg-[#191919] rounded-md justify-between flex-row">
        <View>
          <Text className="text-white font-semibold text-base">{name}</Text>
          <Text className="text-gray-400 text-sm">
            {artists.map((a) => a.name).join(', ')} • {album.name}
          </Text>
        </View>
        <View>
          <Text className="text-gray-500 text-">{formatDuration(duration_ms)}</Text>
        </View>
      </TouchableOpacity>
    );
  }
export default SearchTracks