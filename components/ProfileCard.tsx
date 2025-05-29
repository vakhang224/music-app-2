import React, { useCallback, useContext, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { ThemeContext } from '@/theme/ThemeContext';
import { useProfile } from '@/components/ProfileContext';
import { useAuth } from '@/context/authProvide';
import { UserData } from '@/interface/interfaces';

const API_IP = process.env.EXPO_PUBLIC_URL_API;

const ProfileCard = () => {
  const { profile, setProfile } = useProfile();
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();
  const { card, text, subtitle } = useContext(ThemeContext);
  const { accessToken, userData } = useAuth();

  const profileImage = profile.image
    ? { uri: profile.image }
    : require('@/assets/images/profile.webp');

  const userDT: UserData = userData || {
    User_ID: 0,
    Account_ID: 0,
    Name_User: '',
    Country: '',
  };

useFocusEffect(
  useCallback(() => {
    const fetchUserData = async () => {
      if (!userData?.User_ID) return;

      try {
        const response = await fetch(`${API_IP}/users/${userData.User_ID}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Lỗi khi tải dữ liệu người dùng');
        const data = await response.json();
        setUser(data);

        setProfile((prev) => ({
          ...prev,
          name: data.Name_User ?? prev.name,
          email: data.Email ?? prev.email,
          image: data.Image_URL ?? prev.image,
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userData?.User_ID, accessToken])
);


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
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          overflow: 'hidden',
          marginRight: 16,
        }}
      >
        <Image
          source={profileImage}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text
          style={{
            color: text,
            fontWeight: 'bold',
            fontSize: 18,
            marginBottom: 4,
          }}
        >
          {profile.name || 'Tên người dùng'}
        </Text>
        <Text
          style={{
            color: subtitle,
            fontSize: 14,
          }}
        >
          3 danh sách nhạc
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ProfileCard;
