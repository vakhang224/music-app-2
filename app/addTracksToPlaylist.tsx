import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, TextInput } from "react-native-gesture-handler";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { searchTracks } from "@/services/api";
import { Artist, Track } from "@/interface/interfaces";
import { useAuth } from "@/context/authProvide";
import { Track as TrackAPI } from "@/interface/interfaces";


import { usePlaylistStore } from "@/store/playlistStore";

const AddTracksToPlayList = () => {
  const URL_API = process.env.EXPO_PUBLIC_URL_API
  console.log(URL_API)
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [trackData, setTrackData] = useState<TrackAPI[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [dataSelected, setDataSelected] = useState<TrackAPI[]>([]);
  const { accessToken, refreshTokenIfNeeded } = useAuth();
  const {shouldReload, triggerReload } = usePlaylistStore();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    if (searchQ.trim() === "") {
      setTrackData([]);
      return;
    }

    const handler = setTimeout(() => {
      const fetchTrack = async () => {
        await refreshTokenIfNeeded();
        try {
          const result = await searchTracks(searchQ, 10, 0);
          setTrackData(result as Track[]);
        } catch (error) {
          console.error(error);
          setTrackData([]);
        }
      };
      fetchTrack();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQ]);

  const toggleSelect = (track: TrackAPI) => {
    setDataSelected((prev: TrackAPI[]) =>
      prev.some((item: TrackAPI) => item.id === track.id)
        ? prev.filter((item: TrackAPI) => item.id !== track.id)
        : [...prev, track]
    );
  };

  const addTracks = async () => {
    // console.log(`${URL_API}/playlist/${id}/tracks`)
    try {
      const response = await fetch(`${URL_API}/playlist/${id}/tracks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
     body: JSON.stringify({ tracks: dataSelected.map((item: TrackAPI) => ({ id: item.id, name: item.name })) }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("Added tracks:", data);
        router.replace(`/playlists/${id}`);
      } else {
        const error = await response.json().catch(() => ({}));
        alert(
         `${error.message}`
        );
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }


  };

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#364769", "#1F2A42", "#111827"]}
        className="flex-1 justify-center items-center"
      >
        <View className="flex-1">
          <View className="flex-1 flex flex-col gap-4">
            <View className="flex flex-col items-center">
              <View className="w-full p-3 flex-row items-center gap-8">
                <Text className="font-bold text-white" style={{ fontSize: 36 }}>
                  Chọn bài hát yêu thích
                </Text>
              </View>

              <View className="w-[90%] flex-row items-center justify-center relative">
                <TextInput
                  placeholder="Tìm kiếm nhạc..."
                  className="bg-white rounded-md w-full pl-10 py-2"
                  value={searchQ}
                  onChange={(event) => setSearchQ(event.nativeEvent.text)}
                />
                <FontAwesome
                  name="search"
                  size={15}
                  color="black"
                  style={{ position: "absolute", left: 10 }}
                />
              </View>
            </View>

            <FlatList
              data={trackData}
              className="p-5"
              keyExtractor={(item) => item.id}
              contentContainerStyle={{paddingBottom:200}}
              renderItem={({ item }) => {
                const isSelected = dataSelected.some((it: TrackAPI) => it.id === item.id);
                return (
                  <TouchableOpacity
                    className={`flex-row gap-4 w-[350px] mb-3 items-center rounded-lg ${
                      isSelected ? "bg-gray-700" : ""
                    }`}
                    onPress={() => toggleSelect(item)}
                  >
                    <Image
                      source={{ uri: item.album.images[0].url }}
                      className="w-16 h-16 rounded-l-md"
                    />
                    <View className="flex-1">
                      <Text
                        style={{ color: "white" }}
                        className="font-semibold"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                      <Text style={{ color: "white", fontSize: 12 }}>
                        {item.artists.map((a, i) => `${a.name}${i !== item.artists.length - 1 ? ", " : ""}`)}
                      </Text>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={20} color="white" style={{right:10}}/>
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>

        <View
          style={{ position: "absolute", bottom: 60, width: 100 }}
          className="bg-white p-3 rounded-full"
        >
          <TouchableOpacity onPress={addTracks}>
            <Text className="font-bold text-xl text-center">xong</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AddTracksToPlayList;

const styles = StyleSheet.create({});
