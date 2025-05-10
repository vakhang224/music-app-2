import "./global.css";
import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack>
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
  </Stack>;
}
