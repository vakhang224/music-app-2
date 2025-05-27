import "./global.css";
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/authProvide";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MusicBar from "@/components/musicBar";
import { View } from "react-native";
import { PortalProvider } from "@gorhom/portal";
import MiniPlayer from "@/components/MiniPlayer";
import { useEffect } from "react";
import { URL_API } from "@env";
export default function RootLayout() {

  return (
    <GestureHandlerRootView className="relative">
      <PortalProvider>
        <AuthProvider>   
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="song/[id]" options={{ headerShown: false }} />
          <Stack.Screen
            name="playlists/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="auths/Login" options={{ headerShown: false }} />
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="auths/SignIn" options={{headerShown:false}}/>
          <Stack.Screen name="auths/SignUp" options={{headerShown:false}}/>
        
        </Stack>

        <MiniPlayer/>
        </AuthProvider>
      </PortalProvider>
    </GestureHandlerRootView>
  );
}
