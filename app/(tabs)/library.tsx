import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { ThemeContext } from '@/theme/ThemeContext';

const Library = () => {
  const { background, text } = useContext(ThemeContext);

  return (
    <View style={{ flex: 1, backgroundColor: background, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: text, fontSize: 20 }}>Library</Text>
    </View>
  );
};

export default Library;
