import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FlatList } from "react-native";
import {
  AntDesign,
  FontAwesome,
  FontAwesome6,
  Fontisto,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/authProvide";
import { Artist, LibraryArtist, Playlist } from "@/interface/databaseModel";
import BottomSheetPlaylist from "@/components/BottomSheetPlaylist";
import { bottomSheetPlaylistRef } from "@/components/BottomSheetPlaylist";
import { fetchMultipleArtists } from "@/services/api";
import BottomSheetArtist, {
  bottomSheetArtistRef,
} from "@/components/BottomSheetArtist";
import BottomSheetSort, {
  bottomSheetSortRef,
} from "@/components/bottomSheetSort";

import { typeSort } from "@/interface/databaseModel";
import { typeNumberColumn } from "@/interface/databaseModel";
import { ThemeContext } from '@/theme/ThemeContext';
import { useContext } from "react";

export default function library() {
  const URL_API = process.env.EXPO_PUBLIC_URL_API
  console.log(URL_API)
  const { accessToken, refreshTokenIfNeeded } = useAuth();
  const [artistlibraryData, setArtistLibaryData] = useState<LibraryArtist[]>(
    []
  );
  const [artistData, setArtistData] = useState<Artist[]>([]);
  const [playlistData, setPlaylistData] = useState<Playlist[]>([]);
  const [playListID, setPlaylistID] = useState("");
  const bottomSheetRef = useRef<bottomSheetPlaylistRef>(null);
  const bottomSheetArtistRef = useRef<bottomSheetArtistRef>(null);
  const bottomSheetSortRef = useRef<bottomSheetSortRef>(null);
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [currentData, setCurrentData] = useState<(Playlist | Artist)[]>([]);
  const [sortCurrent, setSortCurrent] = useState<typeSort>(typeSort.default);
  const [numberColumn, setNumberColumn] = useState<typeNumberColumn>(
    typeNumberColumn.defaultColumn
  );
  const [selectN, setSelectN] = useState("");
   const { isDarkMode, toggleDarkMode, background, text, primary,card } = useContext(ThemeContext);

const fetchLibrary = async () => {
  try {
    await refreshTokenIfNeeded();
    const res = await fetch(`${URL_API}/library`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!res.ok) {
      console.error("Failed to fetch library:", res.status, await res.text());
      return;
    }

    const data = await res.json();
    console.log("Library data:", data);

    const artist = data.artist || [];
    const playlist = data.playlist || [];

    setArtistLibaryData(artist);
    setPlaylistData(
      playlist.map((item: Playlist) => ({
        ...item,
        category: "playlist",
      }))
    );
  } catch (error) {
    console.error("Fetch error:", error);
  }
};

  async function handleFetchArtists() {
    try {
      if (!Array.isArray(artistlibraryData) || artistlibraryData.length === 0)
        return;
      const Artists = await fetchMultipleArtists(artistlibraryData);
      setArtistData(
        (Artists ?? []).map((item: Artist) => ({
          ...item,
          category: "artist",
        }))
      );
    } catch (err) {
      console.error("Error fetching artists:", err);
    }
  }

  useEffect(() => {
    if(accessToken){
              fetchLibrary();
    console.log("Loading")
    }

  }, [accessToken]);

  useEffect(() => {
    handleFetchArtists();
  }, [artistlibraryData]);

  useEffect(() => {
    setCurrentData([...playlistData, ...artistData]);
    console.log(currentData)
  }, [playlistData, artistData]);

  function handlePlaylist(id: string) {
    setPlaylistID(id);
    bottomSheetRef.current?.open();
  }

  function handleSelectFilter(item: string) {
    if (item === selectN) {
      setSelectN("");
      setCurrentData([...playlistData, ...artistData]);
    } else {
      setSelectN(item);
    }
  }

  function handleSort(typeSort: typeSort) {
    setSortCurrent(typeSort);
    bottomSheetSortRef.current?.close();
  }

  useEffect(() => {
    let sortedData = [...currentData];
    switch (sortCurrent) {
      case typeSort.alphaSort:
        sortedData.sort((a, b) => {
          const nameA = "name" in a ? a.name : a.Name_Playlist;
          const nameB = "name" in b ? b.name : b.Name_Playlist;
          return nameA.localeCompare(nameB);
        });
        break;

      case typeSort.dateSort:
        sortedData.sort((a, b) => {
          const dateA =
            "Date_current" in a ? new Date(a.Date_current) : new Date(0);
          const dateB =
            "Date_current" in b ? new Date(b.Date_current) : new Date(0);
          return dateB.getTime() - dateA.getTime(); // mới nhất lên đầu
        });
        break;
      case typeSort.default:
      default:
        break;
    }

    setCurrentData(sortedData);
  }, [sortCurrent]);

  const ArtistItem = ({
    artist,
    onPress,
  }: {
    artist: Artist;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`mb-4 ${
        numberColumn == typeNumberColumn.defaultColumn
          ? "flex-row w-full gap-3"
          : "flex-col w-1/3 justify-center items-center"
      }`}
    >
      <Image
        source={{
          uri:
            artist.images?.[0]?.url ??
            "https://i.scdn.co/image/ab6761610000e5ebbcb1c184c322688f10cdce7a",
        }}
        className={`rounded-full ${
          numberColumn === typeNumberColumn.defaultColumn ? "w-16 h-16" : ""
        }`}
        style={
          numberColumn === typeNumberColumn.ThreeColumn
            ? { width: 100, height: 100 }
            : {}
        }
      />
      <View
        className={
          numberColumn === typeNumberColumn.defaultColumn
            ? `flex h-14`
            : "justify-center items-center"
        }
      >
        <Text className="text-white font-bold">{artist.name}</Text>
        <Text className="text-white text-sm">Nghệ sĩ</Text>
      </View>
    </TouchableOpacity>
  );

  const PlaylistItem = ({
    playlist,
    onPress,
    onLongPress,
  }: {
    playlist: Playlist;
    onPress: () => void;
    onLongPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      onLongPress={onLongPress}
      className={`mb-4 ${
        numberColumn == typeNumberColumn.defaultColumn
          ? "flex-row w-full gap-3"
          : "flex-col w-1/3 items-center justify-center"
      }`}
    >
      <View className="rounded-md">
        <Image
          source={require("@/assets/images/bg_bocchi.png")}
          className={`rounded-full ${
            numberColumn === typeNumberColumn.defaultColumn
              ? "w-16 h-16 "
              : ""
          }`}
          style={{
            backgroundColor: card,
            ...(numberColumn === typeNumberColumn.ThreeColumn
              ? { width: 100, height: 100 }
              : {})
          }}
        />
      </View>
      <View
        className={
          numberColumn === typeNumberColumn.defaultColumn
            ? `flex h-14`
            : "justify-center items-center"
        }
      >
        <Text style={{ color: text }} className="font-bold">{playlist.Name_Playlist}</Text>
        <Text style={{ color: text }} className="text-white text-sm">Danh sách phát</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
<View className="w-full flex flex-col gap-3 p-4">
  <View className="flex flex-row justify-between">
    <Text style={{ color: text }} className=" text-3xl font-bold">Thư viện</Text>

    <View className="flex flex-row gap-6">
      <TouchableOpacity
        onPress={() => {
          console.log("Search");
        }}
      >
        <Fontisto name="search" size={24} color={text}/>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          router.push("../addPlayListToLibrary");
        }}
      >
        <FontAwesome6 name="add" size={24} color={text} />
      </TouchableOpacity>
    </View>
  </View>

  <View className="tag flex flex-row gap-2">
    <TouchableOpacity
      onPress={() => {
        if (selectN !== "playlist") {
          setCurrentData(playlistData);
        }
        setSortCurrent(typeSort.default);
        handleSelectFilter("playlist");
      }}
      style={{
        padding: 12,
        borderRadius: 999,
        backgroundColor: selectN === "playlist" ? primary : card,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: selectN === "playlist" ? primary : text, 
        }}
      >
        Danh sách phát
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => {
        if (selectN !== "artist") {
          setCurrentData(artistData);
        }
        setSortCurrent(typeSort.default);
        handleSelectFilter("artist");
      }}
      style={{
        padding: 12,
        borderRadius: 999,
        backgroundColor: selectN === "artist" ? primary : card,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: selectN === "artist" ? primary : text,
        }}
      >
        Tác giả
      </Text>
    </TouchableOpacity>
  </View>

  <View className="flex flex-row justify-between items-center p-3 rounded-2xl">
    <TouchableOpacity
      onPress={() => {
        bottomSheetSortRef.current?.open();
      }}
      className="flex flex-row gap-3 items-center"
    >
      <FontAwesome name="sort" size={24} style={{ color: text }}/>
      <Text style={{ color: text }}>
        {typeSort.default === sortCurrent
          ? "Sắp xếp"
          : typeSort.alphaSort === sortCurrent
          ? "Sắp xếp theo chữ cái"
          : "Gần đây"}
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => {
        setNumberColumn(
          numberColumn === typeNumberColumn.defaultColumn
            ? typeNumberColumn.ThreeColumn
            : typeNumberColumn.defaultColumn
        );
      }}
      className="flex flex-row gap-3 items-center"
    >
      <AntDesign name="appstore-o" size={24} color={text} />
    </TouchableOpacity>
  </View>

  <View className="flex flex-col gap-1 w-full h-full">
    <FlatList
      contentContainerStyle={{ paddingBottom: 700 }}
      data={currentData}
      numColumns={numberColumn + 1}
      key={numberColumn + 1}
      keyExtractor={(item) => {
        if (
          item.category === "artist" &&
          "Library_Artist_ID" in item &&
          item.Library_Artist_ID
        ) {
          return item.Library_Artist_ID.toString();
        }
        if (
          item.category === "playlist" &&
          "Playlist_ID" in item &&
          item.Playlist_ID
        ) {
          return item.Playlist_ID.toString();
        }
        return Math.random().toString();
      }}
      renderItem={({ item }) => {
        if (item.category === "artist") {
          const artist = item as Artist;

          return (
            <ArtistItem
              artist={artist}
              onPress={() => {
                setSelectedArtist(artist);
                bottomSheetArtistRef.current?.open();
              }}
            />
          );
        } else if (item.category === "playlist") {
          const playlist = item as Playlist;
          return (
            <PlaylistItem
              playlist={playlist}
              onPress={() => router.push(`/playlists/${playlist.Playlist_ID}`)}
              onLongPress={() => handlePlaylist(playlist.Playlist_ID)}
            />
          );
        }
        return null;
      }}
      className="w-full"
      ListFooterComponent={() => (
        <TouchableOpacity
          onPress={() => router.push("/addArtistToLibrary")}
          className={`mb-4 ${
            numberColumn === typeNumberColumn.defaultColumn
              ? "flex-row w-full gap-3"
              : "flex-col w-1/3 justify-center items-center"
          }`}
        >
          <View
            className="rounded-full justify-center items-center"
            style={{
              backgroundColor: card,
              ...(numberColumn === typeNumberColumn.defaultColumn
                ? { width: 64, height: 64 }
                : { width: 100, height: 100 }),
            }}
          >
            <FontAwesome6 name="add" size={30} color={text}  />
          </View>
          <View
            className={
              numberColumn === typeNumberColumn.defaultColumn
                ? "flex h-14 justify-center"
                : "justify-center items-center"
            }
          >
            <Text style={{ color: text }} className="font-bold">Thêm nghệ sĩ</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  </View>
</View>
      {playlistData.find((item) => item.Playlist_ID === playListID) && (
        <BottomSheetPlaylist
          ref={bottomSheetRef}
          data={playlistData.find((item) => item.Playlist_ID === playListID)!}
          onSuccess={fetchLibrary}
        />
      )}

      {selectedArtist && (
        <BottomSheetArtist
          ref={bottomSheetArtistRef}
          data={selectedArtist}
          onSuccess={fetchLibrary}
        />
      )}

      {<BottomSheetSort ref={bottomSheetSortRef} onTypeSort={handleSort} />}
    </SafeAreaView>
  );
}
