import { View, Text, TextInput } from 'react-native'
import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Props{
  placeholder: string,
  value?:string
  onChangeText?: (text: string) => void
}

const SearchBar = ({placeholder, value, onChangeText}: Props) => {
  return (
    <View style={{backgroundColor:"white", marginRight: 30, borderRadius:3 }} className="flex-row items-center ">
        <FontAwesome  name="search" 
                        size={15} 
                        color="black"
                        resizeMode="contain"
                        className='ml-5'
        />
        <TextInput
            placeholder={placeholder}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="black"
            className="flex-1 ml-5 text-black "
        />
    </View>
  )
}

export default SearchBar