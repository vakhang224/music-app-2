import React, { useContext } from 'react';
import { View, Image, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { ThemeContext } from '@/theme/ThemeContext';
import { useNavigation } from 'expo-router';
import EditProfile from '@/app/profiles/EditProfile';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useProfile } from '@/components/ProfileContext';
import ProfileCard from '@/components/ProfileCard';  // Đường dẫn đúng tới ProfileContext

const Setting = () => {
  const { isDarkMode, toggleDarkMode, background, text, primary } = useContext(ThemeContext);
  const { profile } = useProfile();
  const profileImage = profile.image
    ? { uri: profile.image }
    : require('@/assets/images/profile.webp');
  const navigation = useNavigation();
  const router = useRouter();
  const { card } = useContext(ThemeContext);



  useFocusEffect(
    useCallback(() => {
      console.log('Refreshed profile:', profile);
    }, [profile])


  );

  return (
    <View className="flex-1" style={{ backgroundColor: background }}>
      <View className="justify-between">
        <Text style={{ color: text }} className="text-3xl mt-4 ml-7 font-bold">
          Cài đặt
        </Text>

        <ScrollView style={{ height: '65%' }} contentContainerStyle={{ paddingTop: 5 }}>
          {/* Profile Card */}
          <ProfileCard />

          {/* Toggle Background Color */}
          <View className="flex-row items-center justify-between px-4 py-3 mx-4 rounded-lg" style={{ backgroundColor: 'transparent' }}>
            <Text className="text-lg" style={{ color: text }}>Đổi màu nền</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor="#f4f3f4"
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleDarkMode}
              value={isDarkMode}
            />
          </View>
        </ScrollView>

        {/* Logout Button */}
        <View
          style={{
            backgroundColor: card,
            paddingVertical: 16,
            alignItems: 'center',
            marginHorizontal: 20,
            borderRadius: 16,
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            style={{
              paddingVertical: 8,
              paddingHorizontal: 20,
              borderRadius: 8,
            }}
            onPress={() => {


              // Chuyển hướng về màn hình đăng nhập
              router.replace('../auths/SignIn');
            }}
          >
            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 16 }}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Setting;
