import "./global.css";
import { Stack } from "expo-router";
import { ProfileProvider } from '@/components/ProfileContext';
import { ThemeProvider, ThemeContext } from '@/theme/ThemeContext';
import React, { useContext } from 'react';
import { AuthProvider, useAuth } from "@/context/authProvide";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MusicBar from "@/components/musicBar";
import { View } from "react-native";
import { PortalProvider } from "@gorhom/portal";
import MiniPlayer from "@/components/MiniPlayer";
import { useEffect } from "react";
export default function RootLayout() {

// ✅ Component con nằm bên trong ThemeProvider => dùng context an toàn
const AppLayout = () => {
  const theme = useContext(ThemeContext);


  
  return (
    
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: theme.background }, // Sử dụng theme ở đây
        headerShown: false,
      }}
    >
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="/album/[id]" />
      <Stack.Screen name="/artists/[id]" />
      <Stack.Screen name="profiles/EditProfile" />
    </Stack>
  );
};

export default function RootLayout() {
  return (
    <ProfileProvider>
      <ThemeProvider>
        <AppLayout />
      </ThemeProvider>
    </ProfileProvider>
  );
}