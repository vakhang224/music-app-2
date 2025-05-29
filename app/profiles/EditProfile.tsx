import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProfile } from '@/components/ProfileContext';
import { ThemeContext } from '@/theme/ThemeContext';
import { useAuth } from '@/context/authProvide';
import { UserData } from '@/interface/interfaces';
import { CheckEmail } from '../utils/checkEmail';
const API_URL = process.env.EXPO_PUBLIC_URL_API
const EditProfile = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const { userData, accessToken } = useAuth();
  const userDT: UserData = userData || { User_ID: 0, Account_ID: 0, Name_User: '', Country: '', Email: '' };
  const { background, text, primary, isDarkMode, card, subtitle } = useContext(ThemeContext);

  const [name, setName] = useState(profile?.name || '');
  const [email, setEmail] = useState(profile?.email || '');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<string | null>(profile?.image || null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userDT.Name_User) setName(userDT.Name_User);
    if (userDT.Email) setEmail(userDT.Email);
  }, [userDT]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setProfile(prev => ({ ...prev, name }));
    }, 500);
    return () => clearTimeout(timeout);
  }, [name]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Cho phép ứng dụng truy cập ảnh');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      const selectedUri = result.assets[0].uri;
      setImage(selectedUri);
      setProfile(prev => ({ ...prev, image: selectedUri }));
    }
  };

const handleSave = async () => {
  if (!CheckEmail(email)) {
    Alert.alert('Email không hợp lệ');
    return;
  }

  setLoading(true);

  try {
    const res = await fetch(`${API_URL}/users/${userDT.User_ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',      // <--- bổ sung header này
        Authorization: `Bearer ${accessToken}`,  // đảm bảo accessToken có giá trị
      },
      body: JSON.stringify({
        Name_User: name,
        Account_ID: userDT.Account_ID,
        Email: email,
      }),
    });

    console.log('Response:', res);

    if (!res.ok) {
      const errorText = await res.text();
      console.log('Error response:', errorText);
      throw new Error('Cập nhật thông tin thất bại');
    }

    setProfile(prev => ({
      ...prev,
      name,
      email,
      image,
    }));

    Alert.alert('Thành công', 'Cập nhật thông tin thành công');
    navigation.goBack();

  } catch (error) {
    Alert.alert('Lỗi', error.message || 'Có lỗi xảy ra');
  } finally {
    setLoading(false);
  }
};

  return (
    <View style={{ flex: 1, backgroundColor: background }} className="px-4 pt-10">
      <TouchableOpacity
        className="absolute top-10 left-4 z-10"
        onPress={() => router.push('/(tabs)/setting')}
      >
        <Ionicons name="arrow-back" size={28} color={text} />
      </TouchableOpacity>

      <View className="items-center justify-center mt-12">
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={image ? { uri: image } : require('@/assets/images/profile.webp')}
            style={{ width: 120, height: 120, borderRadius: 60, marginBottom: 10 }}
          />
          <Text style={{ color: text }} className="text-center mb-4">Chọn ảnh</Text>
        </TouchableOpacity>

        <TextInput
          style={{ color: text }}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-lg"
          placeholder="Tên hiển thị"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={{ color: text }}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-lg"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={{ color: text }}
          className="w-full border border-gray-300 rounded px-4 py-2 mb-4 text-lg"
          placeholder="Mật khẩu"
          placeholderTextColor={isDarkMode ? '#AAAAAA' : '#666666'}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded flex-row justify-center items-center"
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={{ color: 'white' }} className="font-bold text-lg">Lưu thay đổi</Text>
          )}
        </TouchableOpacity>

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
              source={image ? { uri: image } : require('@/assets/images/profile.webp')}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1 justify-center">
            <Text style={{ color: text, fontWeight: 'bold', fontSize: 18, marginBottom: 4 }}>
              {profile.name}
            </Text>
            <Text style={{ color: subtitle, fontSize: 14, marginBottom: 4 }}>
              3 danh sách nhạc
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfile;
