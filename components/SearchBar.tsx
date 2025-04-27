import { View, Text, TextInput } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';

const SearchBar = () => {
  return (
    <View style={{backgroundColor:"white", marginRight: 30, borderRadius:3 }} className="flex-row items-center ">
        <FontAwesome  name="search" 
                        size={15} 
                        color="black"
                        resizeMode="contain"
                        className='ml-5'
        />
        <TextInput
            onPress={() => {}}
            placeholder="Tìm kiếm"
            value=""
            onChangeText={() => {}}
            placeholderTextColor="black"
            className="flex-1 ml-5 text-white "
        />
    </View>
  )
}

export default SearchBar