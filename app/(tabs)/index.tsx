import { Button, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';

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

        <View className="flex flex-row justify-between items-center h-16 bg-red-500">

          <View className="bg-blue-500 ml-5"> 
            <Text className="text-white text-3xl"> Trang Chu </Text>
          </View>

          <View className=" flex flex-row w-24 bg-purple-400 items-center justify-center">
            <TouchableOpacity className=" bg-gray-500 mr-6">
              <Image style={{ tintColor: 'white' }} className="w-6 h-6" source={require("@/assets/icons/notification.png")}/>
            </TouchableOpacity>

            <TouchableOpacity className=" bg-gray-500 mr-6">
              <Image style={{ tintColor: 'white' }} className="w-6 h-6" source={require("@/assets/icons/history.png")}/>
            </TouchableOpacity>
          </View>
        </View>

      </View>
    // </LinearGradient>
  );
}
