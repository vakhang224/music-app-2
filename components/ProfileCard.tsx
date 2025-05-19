
import React, { useContext } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useProfile } from '@/components/ProfileContext';

const ProfileCard = () => {
    const { profile } = useProfile();
    const router = useRouter();
    const { card, text, subtitle } = useContext(ThemeContext);

  const profileImage = profile.image
    ? { uri: profile.image }
    : require('@/assets/images/profile.webp');

  return (
    <TouchableOpacity
      style={{
        backgroundColor: card,              
        padding: 20,
        marginTop: 4,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
      }}
      onPress={() => router.push('/profiles/EditProfile')}
    >
      <View className="w-20 h-20 rounded-full overflow-hidden mr-4">
        <Image
          source={profileImage}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>
      <View className="flex-1 justify-center">
        <Text style={{
          color: text,                        
          fontWeight: 'bold',
          fontSize: 18,
          marginBottom: 4
        }}>{profile.name}</Text>


        <Text style={{
          color: subtitle,
          fontSize: 14,
          marginBottom: 4
        }}>3 danh sách nhạc</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCard;
