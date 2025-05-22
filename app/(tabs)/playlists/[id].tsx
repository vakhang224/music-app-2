import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import SongCard from "@/components/songsCard";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import Foundation from "@expo/vector-icons/Foundation";
import { Portal } from "@gorhom/portal";
import { useAuth } from "@/context/authProvide";
import { Playlist } from "@/interface/databaseModel";
import { Track } from "@/interface/databaseModel";
import { Track as TrackAPI } from "@/interface/interfaces";
import { fetchTracks } from "@/services/api";
import { usePlaylistStore } from "@/store/playlistStore";
import { typeSort } from "@/interface/databaseModel";
import BottomSheetSort, { bottomSheetSortRef } from "@/components/bottomSheetSort";
const PlayList = () => {
  const URL_API = process.env.EXPO_PUBLIC_URL_API
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();
  const [track, Settrack] = useState<TrackAPI>();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const bottomSheetRefPlayList = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["50%", "100%"], []);
  const [dataPlaylist, setDataPlayList] = useState<Playlist>();
  const [dataTrackApi, setDataTrackApi] = useState<TrackAPI[]>([]);
  const [dataTracksDatabase,setDataTrackDatabase] = useState<Track[]>([]);
  const { accessToken, refreshTokenIfNeeded } = useAuth();
  const bottomSheetSortRef = useRef<bottomSheetSortRef>(null);
  const [sortCurrent, setSortCurrent] = useState<typeSort>(typeSort.default);
  
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);
  const handleSongInPlayList = (track: TrackAPI) => {
    Settrack(undefined);
    bottomSheetRef.current?.snapToIndex(1);
    Settrack(track);
  };

  
  function handleSort(typeSort: typeSort) {
    setSortCurrent(typeSort);
    bottomSheetSortRef.current?.close();
  }


  const handlePlaylist = () => {
    bottomSheetRefPlayList.current?.snapToIndex(1);
  };

  const { shouldReload, resetReload } = usePlaylistStore();

  useEffect(() => {
    const reloadTracks = async () => {
      if (shouldReload) {
        await fetchDataTracks();
        resetReload();
      }
    };
    reloadTracks();
  }, [shouldReload]);

  useEffect(() => {
    setDataPlayList(undefined);
    setDataTrackApi([]);
    const fetchDataPlaylist = async () => {
      await refreshTokenIfNeeded();
      try {
        const response = await fetch(`${URL_API}/playlist/${id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const data = await response.json();
        setDataPlayList(data.playlist as Playlist);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDataPlaylist();
    fetchDataTracks();
  }, [id]);

  const fetchDataTracks = async () => {
    await refreshTokenIfNeeded();
    try {
      const response = await fetch(`${URL_API}/playlist/${id}/tracks/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const data = await response.json();
      const dataTracksDatabase = data.data as Track[];
      setDataTrackDatabase(dataTracksDatabase)

      setDataTrackApi(await handleDataTrackAPI(dataTracksDatabase))
    }
    catch(err){
      console.error(err)
    }
  };

async function handleDataTrackAPI(dt: Track[]): Promise<TrackAPI[]> {
  try {
    if (dt) {
      const ids = dt.map((item: Track) => item.Track_ID);
      const data = await fetchTracks({ query: ids.join(",") });
      return data.tracks;
    } else {
      return [];
    }
  } catch (err) {
    console.error(err);
    return [];
  }
}

  async function deleteHandleTrackApi(trackID: String) {
    try {
      const response = await fetch(`${URL_API}/playlist/${id}/tracks`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ ids: [trackID] }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw err;
      }
      const data = await response.json();
      bottomSheetRef.current?.close();
      await fetchDataTracks();
    } catch (err) {
      console.error("Error deleting tracks:", err);
    }
  }

  
  useEffect(() => {
    let sortedData = [...dataTrackApi];
    switch (sortCurrent) {
      case typeSort.alphaSort:
        sortedData.sort((a,b)=>a.name.localeCompare(b.name))
        break;
      case typeSort.dateSort:
        (async () => {
          await fetchDataTracks();
          const sortDBTrack = dataTracksDatabase.sort((a, b) => new Date(a.Date_current).getTime() - new Date(b.Date_current).getTime())
          const db = await handleDataTrackAPI(sortDBTrack);
          setDataTrackApi(db);
        })();
        return; // Prevents setDataTrackApi(sortedData) below from running
      case typeSort.default:
      default:
        break;
    }
    setDataTrackApi(sortedData)
  }, [sortCurrent]);


  // function handlePlayMusic(){
  //   if(dataTrackApi){
  //     setPlayList(dataTrackApi)
  //      router.push({ pathname: "/song/[id]", params:{ id: dataTrackApi[0].id,track:JSON.stringify(dataTrackApi[0])}});
  //   } 
  // }

  return (
    <SafeAreaView
      key={Array.isArray(id) ? id[0] : id?.toString()}
      style={{ flex: 1 }}
    >
      <LinearGradient
        colors={["#111827", "#1F2A42", "#111827"]}
        className="flex-1"
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 200 }}
        >
          <View className="flex flex-col gap-3 items-center ">
            <View className="bg-transparent w-full p-3 flex flex-row items-center gap-8">
              <TouchableOpacity
                onPress={() => {
                  router.push("/library");
                }}
              >
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>

              <Text className="font-bold text-2xl text-white">
                {dataPlaylist?.Name_Playlist}
              </Text>
            </View>

            <View className="w-[90%] flex flex-row fixed top-0 items-center justify-center">
              <TextInput
                placeholder="Search..."
                className="bg-white rounded-md w-full pl-10"
              />
              <FontAwesome
                name="search"
                size={15}
                color="black"
                className="absolute left-3"
              />
            </View>

            <View className="flex flex-col items-center gap-3 w-full">
              <Image
                source={require("@/assets/images/bg_bocchi.png")}
                className="rounded-md w-48 h-48 mt-5"
              />

              <View className="InfoPlayListb w-full">
                <Text className="text-white font-bold text-3xl text-center">
                  {dataPlaylist?.Name_Playlist}
                </Text>
              </View>
            </View>
            {/* Tag thông tin của playlist */}
            <View className="tag flex flex-row p-3 items-center w-full justify-between border-white border-b">
              <View className="flex flex-row items-center gap-3">
                <TouchableOpacity>
                  <Image
                    source={require("@/assets/images/bg_bocchi.png")}
                    className="rounded-full w-10 h-10"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>{}}>
                  <Feather name="more-vertical" size={24} color="white" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => {
                  
                  // handlePlayMusic()
                }}
              >
                <View className="bg-white block rounded-full p-4">
                  <Entypo name="controller-play" size={24} color="black" />
                </View>
              </TouchableOpacity>
            </View>

            {/* Thêm sắp xếp chỉnh sửa */}
            <View className="haddlePlayList w-full flex flex-row justify-center items-center gap-3">
              <TouchableOpacity
                onPress={() => {
                  router.replace({
                    pathname: "/addTracksToPlaylist",
                    params: { id: String(id) },
                  });
                }}
                className="bg-white flex flex-row justify-center items-center p-2 gap-2 rounded-full w-[30%]"
              >
                <Entypo name="add-to-list" size={16} color="black" />
                <Text className="font-bold">Thêm</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  bottomSheetSortRef.current?.open()
                }}
                className="bg-white flex flex-row justify-center items-center p-2 gap-2 rounded-full w-[30%]"
              >
                <FontAwesome name="sort" size={16} color="black" />
                <Text className="font-bold">Sắp xếp</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  console.log("Press");
                }}
                className="bg-white flex flex-row justify-center items-center p-2 gap-2 rounded-full w-[30%]"
              >
                <Feather name="edit" size={16} color="black" />
                <Text className="font-bold">Chỉnh sửa</Text>
              </TouchableOpacity>
            </View>

            {/* List nhạc */}
            <View className="w-full flex flex-col px-3 gap-3">
              {dataTrackApi ? dataTrackApi.map((item) => (
                <SongCard
                  key={item.id}
                  track={item}
                  onPress={handleSongInPlayList}
                  playlist={dataTrackApi??[]}
                />
              )) : <View><Text>Hãy thêm nhạc vào nào</Text></View>}
            </View>
          </View>
        </ScrollView>

        <Portal>
          <BottomSheet
            snapPoints={snapPoints}
            ref={bottomSheetRef}
            index={-1}
            enablePanDownToClose={true}
            backgroundStyle={{ backgroundColor: "#171717" }}
            handleIndicatorStyle={{
              backgroundColor: "gray",
              width: 55,
              height: 5,
              borderRadius: 3,
            }}
            onChange={(index) => {
              if (index === -1) {
                Settrack(undefined);
              }
            }}
            backdropComponent={(props) => (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0} // Khi mở thì backdrop hiện
                disappearsOnIndex={-1} // Khi đóng thì backdrop biến mất
                pressBehavior="close" // <- Quan trọng: click vào backdrop sẽ đóng
              />
            )}
          >
            <BottomSheetView className="flex items-center flex-col gap-4 px-10">
              <BottomSheetView className="flex flex-row items-center w-full py-3 gap-3 border-b border-gray-400">
                <Image
                  source={{
                    uri: track?.album.images[0].url,
                  }}
                  className="rounded-md w-16 h-16"
                />
                <BottomSheetView>
                  <Text className="text-white font-bold">{track?.name}</Text>
                  <Text className="text-gray-300 w-[200px]" numberOfLines={1} >
                    {track?.artists
                      .map((item) => item.name)
                      .join(",")
                      .toString()}
                  </Text>
                </BottomSheetView>
              </BottomSheetView>

              <BottomSheetView className="flex flex-col gap-7">
                <TouchableOpacity
                  onPress={() => {
                    console.log("Hello");
                  }}
                  className="w-full"
                >
                  <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                    <FontAwesome6 name="add" size={23} color="white" />
                    <Text className="text-white flex-grow text-[15px]">
                      Thêm vào danh sách phát khác
                    </Text>
                  </BottomSheetView>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    deleteHandleTrackApi(track?.id?.toString() ?? "");
                  }}
                  className="w-full"
                >
                  <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                    <AntDesign name="delete" size={20} color="white" />
                    <Text className="text-white flex-grow text-[15px]">
                      Xóa khỏi danh sách phát
                    </Text>
                  </BottomSheetView>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    bottomSheetRef.current?.close();
                    router.replace({
                      pathname: "/artists/[id]",
                      params: { id: track?.artists[0].id?.toString() ?? "" },
                    });
                  }}
                  className="w-full"
                >
                  <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                    <MaterialCommunityIcons
                      name="account-music"
                      size={20}
                      color="white"
                    />
                    <Text className="text-white flex-grow text-[15px]">
                      Chuyển tới nghệ sĩ
                    </Text>
                  </BottomSheetView>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (track) {
                      bottomSheetRef.current?.close
                      router.push({ pathname: "/song/[id]", params:{ id: track.id,track:JSON.stringify(track)}});
                    }
                  }}
                  className="w-full"
                >
                  <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                    <MaterialIcons name="info" size={24} color="white" />
                    <Text className="text-white flex-grow text-[15px]">
                      Xem thông tin bài hát
                    </Text>
                  </BottomSheetView>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    router.replace({
                      pathname: "/album/[id]",
                      params: { id: track?.album.id?.toString() ?? "" },
                    });
                  }}
                  className="w-full"
                >
                  <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                    <Entypo
                      name="arrow-with-circle-right"
                      size={20}
                      color="white"
                    />
                    <Text className="text-white flex-grow text-[15px]">
                      Chuyển tới album
                    </Text>
                  </BottomSheetView>
                </TouchableOpacity>
              </BottomSheetView>
            </BottomSheetView>
          </BottomSheet>
        </Portal>
        <Portal>
          <BottomSheet
            snapPoints={snapPoints}
            ref={bottomSheetRefPlayList}
            index={-1}
            enablePanDownToClose={true}
            backgroundStyle={{ backgroundColor: "#171717" }}
            handleIndicatorStyle={{
              backgroundColor: "gray",
              width: 55,
              height: 5,
              borderRadius: 3,
            }}
            backdropComponent={(props) => (
              <BottomSheetBackdrop
                {...props}
                appearsOnIndex={0}
                disappearsOnIndex={-1}
                pressBehavior="close"
              />
            )}
          >
            <BottomSheetView className="flex items-center flex-col gap-4 px-10">
              <BottomSheetView className="flex flex-row items-center w-full py-3 gap-3 border-b border-gray-400">
                <Image
                  source={require("@/assets/images/bg_bocchi.png")}
                  className="rounded-md w-16 h-16"
                />
                <BottomSheetView>
                  <Text className="text-white font-bold">
                    {dataPlaylist?.Name_Playlist}
                  </Text>
                </BottomSheetView>
              </BottomSheetView>

              <BottomSheetView className="flex flex-col gap-7">
                <TouchableOpacity
                  onPress={() => {
                    bottomSheetRefPlayList.current?.close()
                    router.push({
                      pathname: "/addTracksToPlaylist",
                      params: { id: dataPlaylist?.Playlist_ID?.toString() ?? "" }
                    })
                  }}
                  className="w-full"
                >
                  <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                    <FontAwesome6 name="add" size={23} color="white" />
                    <Text className="text-white flex-grow text-[15px]">
                      Thêm vào danh sách phát này
                    </Text>
                  </BottomSheetView>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Hello");
                  }}
                  className="w-full"
                >
                  <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                    <Foundation name="page-edit" size={20} color="white" />
                    <Text className="text-white flex-grow text-[15px]">
                      Chỉnh sửa danh sách phát
                    </Text>
                  </BottomSheetView>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Hello");
                  }}
                  className="w-full"
                >
                  <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                    <AntDesign name="delete" size={20} color="white" />
                    <Text className="text-white flex-grow text-[15px]">
                      Xóa danh sách phát
                    </Text>
                  </BottomSheetView>
                </TouchableOpacity>
              </BottomSheetView>
            </BottomSheetView>
          </BottomSheet>
        </Portal>

        <BottomSheetSort ref={bottomSheetSortRef} onTypeSort={handleSort}/>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default PlayList;

const styles = StyleSheet.create({});
