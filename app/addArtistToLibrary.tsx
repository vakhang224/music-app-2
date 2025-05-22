import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { FlatList, ScrollView, TextInput } from "react-native-gesture-handler";
import { FontAwesome } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import ArtistIconSelect from "@/components/artistsIconSelect";
import { searchArtists } from "@/services/api";
import { Artist } from "@/interface/interfaces";
import { useAuth } from "@/context/authProvide";
import { ArtistsResponse } from "@/interface/databaseModel";
const AddArtistsToPlayList = () => {
  const URL_API = process.env.EXPO_PUBLIC_URL_API
  console.log(URL_API)
  const navigation = useNavigation();
  const [artistData, setArtistData] = useState<Artist[]>([]);
  const [searchQ, setSearchQ] = useState("");
  const [dataSelected, setDateSelected] = useState<string[]>([]);
    const { accessToken, refreshTokenIfNeeded } = useAuth();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  useEffect(() => {
    if (searchQ.trim() === "") {
      setArtistData([]); // nếu input rỗng thì clear data luôn
      return;
    }
    const handler = setTimeout(() => {
      const fetchArtist = async () => {
        await refreshTokenIfNeeded()
        try {
          const result = await searchArtists(searchQ, 50, 0);
          setArtistData(result.items);
        } catch (error) {
          console.error(error);
          setArtistData([]);
        }
      };

      fetchArtist();
    }, 100);

    return () => clearTimeout(handler);
  }, [searchQ]);


  async function addArtists(){
    try{
      const response = await fetch(`${URL_API}/library/addartist`,{
        method:"POST",
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ Artist_IDs: dataSelected})
      })

      if(response.ok){
         const data = await response.json();
        router.replace("/(tabs)/library")
        console.log(data)
      }else{
         const error = await response.json().catch(() => ({}));
        console.error("Error creating playlist:", error);
        alert(
          "Lỗi khi tạo playlist: " + (error.message || "Vui lòng thử lại.")
        );
      }

    }catch(err){
      console.error(err)
    }
  }

  return (
    <SafeAreaView className="flex-1">
      <LinearGradient
        colors={["#364769", "#1F2A42", "#111827"]}
        className="flex-1 justify-center items-center"
      >
        <View className="flex-1">
          <View className="flex-1 flex flex-col gap-4">
            <View className="flex flex-col items-center">
              <View className="bg-transparent w-full p-3 flex flex-row items-center gap-8">
                <Text className="font-bold text-white" style={{ fontSize: 40 }}>
                  Chọn thêm nghệ sĩ bạn thích
                </Text>
              </View>

              <View className="w-[90%] flex flex-row fixed top-0 items-center justify-center">
                <TextInput
                  placeholder="Tìm kiếm nghệ sĩ của bạn..."
                  className="bg-white rounded-md w-full pl-10"
                  value={searchQ}
                  onChange={(event) => setSearchQ(event.nativeEvent.text)}
                />
                <FontAwesome
                  name="search"
                  size={15}
                  color="black"
                  className="absolute left-3"
                />
              </View>
            </View>

            <View>
              <FlatList
                data={artistData}
                keyExtractor={(item) => item.id}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "space-around",
                  alignItems: "flex-start",
                  marginBottom: 16,
                }}
                renderItem={({ item }) => (
                  <ArtistIconSelect
                    id={item.id}
                    name={item.name}
                    image={
                      item.images && item.images.length > 0
                        ? item.images[0].url
                        : ""
                    }
                    onSelect={(id, isSelect) => {
                      if (isSelect) {
                        setDateSelected((prev) => {
                          if (!prev.includes(id)) {
                            return [...prev, id]; 
                          }
                          return prev;
                        });
                      } else {
                        setDateSelected((prev) =>
                          prev.filter((itemId) => itemId !== id)
                        );
                      }
                    }}
                  />
                )}
              />
            </View>
          </View>
        </View>
        <View
          style={{ position: "absolute", bottom: 60, width: 100 }}
          className="bg-white p-3 rounded-full"
        >
          <TouchableOpacity onPress={addArtists}>
            <Text className="font-bold text-xl text-center">xong</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AddArtistsToPlayList;

const styles = StyleSheet.create({});
