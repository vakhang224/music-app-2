import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { useNavigation, router } from "expo-router";
import { TextInput } from "react-native-gesture-handler";
import { FontAwesome, Fontisto } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@/context/authProvide";
import { URL_API } from "@env";
const AddPlaylistToPLaylists = () => {
  console.log(URL_API)
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  const { accessToken } = useAuth();
  const [namePlaylist, setNamePlaylist] = useState("danh sách phát mới");
  async function handleCreatePlaylist() {
    try {
      const response = await fetch(
        `${URL_API}/library/addPlaylist`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Name_PlayList: namePlaylist }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        router.replace("/library");
        console.log("Playlist created successfully", data);
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("Error creating playlist:", error);
        alert(
          "Lỗi khi tạo playlist: " + (error.message || "Vui lòng thử lại.")
        );
      }
    } catch (err) {
      console.error("Network or unexpected error:", err);
      alert("Không thể tạo playlist. Lỗi mạng hoặc server.");
    }
  }
  

  return (
    <View className="w-screen h-screen ">
      <LinearGradient
        colors={["#364769", "#1F2A42", "#111827"]}
        className="flex-1 flex justify-center items-center gap-10 bg-black-100"
      >
        <Text className="text-white text-4xl">Thêm mới danh sách phát</Text>
        <View className="w-[90%] flex flex-row fixed top-0 items-center justify-center">
          <TextInput
            placeholder="Tên danh sách phát..."
            value={namePlaylist}
            className="rounded-md w-full text-3xl bg-white"
            onChangeText={(text) => setNamePlaylist(text)}
          />
        </View>

        <View>
          <View className="flex flex-row gap-6 w-[90%]">
            <TouchableOpacity
              onPress={() => {
                router.replace("/library");
              }}
              className="bg-white w-1/2 p-3 rounded-full"
            >
              <Text className="text-2xl text-center">Hủy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreatePlaylist}
              className="bg-pink-400 w-1/2 p-3 rounded-full"
            >
              <Text className="text-2xl text-center text-white">Tạo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default AddPlaylistToPLaylists;

const styles = StyleSheet.create({});
