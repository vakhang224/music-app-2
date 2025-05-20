import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Artist } from "@/interface/interfaces";
interface SongCardProps {
  id: string;
  name: string;
  artist: Artist[];
  url: string;
  onPress:Function
}

const SongCard = ({ name, id, artist, url,onPress}: SongCardProps) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          console.log("info Artist");
        }}
        className="flex flex-row items-center justify-between"
      >
        <View className="flex flex-row items-center gap-4 h-full">
          <Image source={{ uri: url }} className="rounded-md w-16 h-16" />
          <View className="flex gap-2 h-16">
            <Text className="text-white font-bold text-xl">{name}</Text>
            <Text className="text-sm text-gray-400 font-bold">{artist.map(item=>item.name).join(", ")}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={()=>{onPress(id)}}>
          <Feather name="more-vertical" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default SongCard;

const styles = StyleSheet.create({});
