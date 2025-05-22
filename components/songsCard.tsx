import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import React, { useCallback, useMemo, useRef } from "react";
import Feather from "@expo/vector-icons/Feather";
import { Artist, Track as TrackAPI } from "@/interface/interfaces";
import { router } from "expo-router";
interface SongCardProps {
  track:TrackAPI
  onPress:Function
  playlist:TrackAPI[]
}

const SongCard = ({ track,onPress,playlist}: SongCardProps) => {
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          router.push({ pathname: "/song/[id]", params:{ id: track.id,track:JSON.stringify(track),playlist:JSON.stringify(playlist)}});
        }}
        className="flex flex-row items-center justify-between"
      >
        <View className="flex flex-row items-center gap-4 h-full">
          <Image source={{ uri: track.album.images[0].url }} className="rounded-md w-16 h-16" />
          <View className="flex gap-2 h-16">
            <Text className="text-white font-bold text-xl w-[200px]" numberOfLines={1} ellipsizeMode="tail">{track.name}</Text>
            <Text className="text-sm text-gray-400 font-bold w-[200px]" numberOfLines={1}>{track.artists.map(item=>item.name).join(", ")}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={()=>{onPress(track)}}>
          <Feather name="more-vertical" size={20} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    </View>
  );
};

export default SongCard;

const styles = StyleSheet.create({});
