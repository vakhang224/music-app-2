import { Button, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getQuery } from '@/model/getQuery';
import { useEffect, useState } from "react";

export default function Index() {
  const [data, setData] = useState([]);  // Tạo state để lưu dữ liệu

  useEffect(() => {
    async function fetchData() {
      const Data = await getQuery("Son TUng");

      // Kiểm tra dữ liệu từ API
      console.log("Dữ liệu từ getAlbum:", Data);

      // Kiểm tra dữ liệu có hợp lệ không
      setData(Data.albums.items)
    }

    fetchData();  // Gọi hàm fetchData
  }, []);

  return (
    <View className="flex flex-col flex-1">
      <Image className="absolute w-full z-0 h-full bg-gray-900" />

      <View className="flex flex-row justify-between items-center h-16">
        <View className="ml-5">
          <Text className="text-3xl text-white">Trang chủ</Text>
        </View>

        <View className="flex flex-row w-24 items-center justify-center">
          <TouchableOpacity className="mr-6">
            <Ionicons name="notifications" size={22} color="white" className="w-6 h-6 mr-3" />
          </TouchableOpacity>

          <TouchableOpacity className="mr-6">
            <FontAwesome5 name="history" size={20} color="white" className="w-6 h-6 mr-3" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="w-full h-screen">
        <View className="flex flex-col justify-center items-center">
          {data.length > 0 ? (
            data.map((item, index) => (
              <View key={index} className="mb-4 flex items-center">
                {/* Tên album */}
                <Text className="text-white text-lg">{item.name}</Text>

                {/* Hình ảnh album */}
                <Image
                  source={{ uri: item.images[0]?.url }}
                  style={{ width: 200, height: 200, borderRadius: 10 }}
                />

                {/* Thêm các thông tin khác về album nếu cần */}
                <Text className="text-white text-sm mt-2">{item.artists[0]?.name}</Text>
              </View>
            ))
          ) : (
            <Text className="text-white">Không có album nào</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
