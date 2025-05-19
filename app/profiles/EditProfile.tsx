import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProfile } from '@/components/ProfileContext'; // Đường dẫn đúng tới ProfileContext
import { ThemeContext } from '@/theme/ThemeContext';

const EditProfile = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const { profile, setProfile } = useProfile();
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<string | null>(profile.image);
  const { background, text, primary, toggleDarkMode, isDarkMode, card, subtitle } = useContext(ThemeContext);


  //hàm xử lý nhập tên
  useEffect(() => {
  const timeout = setTimeout(() => {
    setProfile(prev => ({ ...prev, name }));
  }, 500); // Cập nhật profile sau khi user dừng gõ 500ms

  return () => clearTimeout(timeout);
}, [name]);



  // Hàm chọn ảnh
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
      setImage(result.assets[0].uri);
      setProfile((prev) => ({ ...prev, image: result.assets[0].uri }));
    }
  };

  const handleSave = () => {
    setProfile((prev) => ({
      ...prev,
      name,
      email,
      image,
    }));
    navigation.goBack(); // Điều hướng về tab Setting sau khi lưu
  };

  return (
    <View style={{ flex: 1, backgroundColor: background }} className="px-4 pt-10">
      {/* Nút quay về */}
      <TouchableOpacity
        className="absolute top-10 left-4 z-10"
        onPress={() => router.push('/(tabs)/setting')} // <-- Điều hướng chính xác về tab Setting
      >
        <Ionicons name="arrow-back" size={28} color={text} />
      </TouchableOpacity>

      {/* Nội dung */}
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


        {/* Nút lưu */}
        <TouchableOpacity
          className="bg-blue-500 px-6 py-3 rounded"
          onPress={handleSave}
        >
          <Text style={{ color: 'white' }} className="font-bold text-lg">Lưu thay đổi</Text>
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
      </View>
    </View>
  );
};


export default EditProfile;
