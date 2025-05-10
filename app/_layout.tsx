import "./global.css";
import { Stack } from "expo-router";
import { useEffect } from "react";
import TrackPlayer from "react-native-track-player";
import MiniPlayer from '../components/MiniPlayer';

export default function RootLayout() {


  return (
    <>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="/album/[id]"
          options={{headerShown:false}}
        />
        <Stack.Screen
          name="/artists/[id]"
          options={{headerShown:false}}
        />
        <Stack.Screen
        name="song/[id]"
        options={{ presentation: 'modal', headerShown: false }} // 👈 đảm bảo đè lên toàn bộ
        />
      </Stack>
      <MiniPlayer />
    </>
);
}
