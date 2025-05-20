// components/MusicPlayerBar.tsx
import { View, Text, TouchableOpacity, Image, Touchable, TouchableWithoutFeedback } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';


export default function MusicBar({ songTitle = "Tên bài hát", artist = "Nghệ sĩ" }) {
  return (
    <View className=" flex-row justify-between items-center p-2 w-full rounded-md bg-white">
        <View className="flex flex-row items-center gap-4 h-full">
          <Image source={{ uri: "https://i.scdn.co/image/ab6761610000e5ebbcb1c184c322688f10cdce7a" }} className="rounded-md" height={50} width={50}/>
          <View className="flex w-2/3">
            <Text className=" font-bold text-xl" numberOfLines={1}>Tò te tá</Text>
            <Text className="text-sm font-bold">Wren evans</Text>
          </View>
        </View>
      <View className="flex-row items-center w-1/3 justify-between gap-3">
        <TouchableOpacity>
          <Ionicons name="add" size={24} color="black" style={{fontWeight:'bold'}}/>
        </TouchableOpacity>
          <TouchableOpacity onPress={()=>{}}>
          <Ionicons name="play" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}