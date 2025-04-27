import { Button, Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from '@expo/vector-icons/Ionicons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { getQuery } from '@/model/getQuery';
import { useEffect, useState } from "react";
import ArtistsCard from "@/components/ArtistsCard";

export default function Index() {


  return (
    <View className="flex flex-col flex-1 bg-blue-400">
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

      <View>
        <ArtistsCard/>
      </View>

    </View>
  );
}