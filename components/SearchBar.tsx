import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useContext } from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ThemeContext } from '@/theme/ThemeContext'; // Assuming ThemeContext.js is in the '@/theme' directory

interface Props {
  placeholder: string,
  value?: string
  onChangeText?: (text: string) => void
}

const SearchBar = ({ placeholder, value, onChangeText }: Props) => {
  const { background, text, border } = useContext(ThemeContext);

  return (
    <View style={[styles.container, { backgroundColor: 'white', borderColor: border }]} className="flex-row items-center ">
      <FontAwesome
        name="search"
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

const styles = StyleSheet.create({
  container: {
    marginRight: 30,
    borderRadius: 3,
    borderWidth: 1, // Add border width
  },
});

export default SearchBar