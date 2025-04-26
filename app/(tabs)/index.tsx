import { Button, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function Index() {
  return (
    // <LinearGradient
    //   colors={['rgba(97, 97, 97, 1)', 'rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 1)']}
    //   style={{ flex: 1 }}
    //   start={{ x: 0, y: 0 }} // Điểm bắt đầu: dưới cùng
    //   end={{ x: 0, y: 1 }}   // Điểm kết thúc: trên cùng
    //   locations={[0, 0.69, 1]} // Xác định vị trí của từng màu
    // >
      <View className="flex-1">
        <Image  className="absolute w-full z-0 h-full bg-gray-900" />

        <View className="flex flex-row justify-between items-center h-16 ">

          <View className=" ml-5"> 
            <Text className=" text-3xl text-white"> Trang chủ </Text>
          </View>

          <View className=" flex flex-row w-24  items-center justify-center">
            <TouchableOpacity className="mr-6">
              <Ionicons name="notifications" size={22} color="white" className="w-6 h-6 mr-3" />
            
            </TouchableOpacity>

            <TouchableOpacity className="mr-6">
              <FontAwesome5 name="history" size={20} color="white" className="w-6 h-6 mr-3" />
            
            </TouchableOpacity>
          </View>
        </View>

      </View>
    // </LinearGradient>
  );
}
