import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, {
  forwardRef,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { Portal } from '@gorhom/portal';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
} from '@gorhom/bottom-sheet';
import {
  AntDesign,
  Entypo,
  FontAwesome6,
  MaterialCommunityIcons,
  MaterialIcons,
} from '@expo/vector-icons';
import { Playlist } from '@/interface/databaseModel';
import { View } from 'react-native';
import { useAuth } from '@/context/authProvide';

type Props = {
  data: Playlist;
  onSuccess:()=>void;
};

export type bottomSheetPlaylistRef = {
    open:()=>void;
    close:()=>void;
}

const BottomSheetPlaylist = forwardRef(({ data,onSuccess }: Props, ref) => {
    const URL_API = process.env.URL_API
  console.log(URL_API)
  const { accessToken, refreshTokenIfNeeded } = useAuth();
  const snapPoints = useMemo(() => ['50%', '100%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(1),
    close: () => bottomSheetRef.current?.close(),
  }));

async function handleDeletePlaylist(id: string) {
  try {

    const response = await fetch(`${URL_API}/playlist/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}` // nếu cần xác thực
      }
    });

    const data = await response.json();

    if (response.ok) {
      alert('Đã xoá playlist thành công!');
      bottomSheetRef.current?.close()
      onSuccess()
    } else {
      alert(`Lỗi: ${data.message}`);
    }
  } catch (error) {
    console.error('Lỗi khi gọi API:', error);
    alert('Không thể kết nối đến máy chủ.');
  }
}

  return (
    <Portal>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: '#171717' }}
        handleIndicatorStyle={{
          backgroundColor: 'gray',
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
          <BottomSheetView className="flex flex-row items-center w-full gap-3 border-b border-gray-400" style={{paddingVertical:15}}>
            <View className='rounded-md bg-white h-16 w-16'>
            <Image
             source={require('../assets/images/bg_bocchi.png')}
              className="w-full h-full"
            />
            </View>
       
            <BottomSheetView>
              <Text className="text-white font-bold text-lg">{data.Name_Playlist||"nah"}</Text>
            </BottomSheetView>
          </BottomSheetView>
        
          <BottomSheetView className="flex flex-col gap-7">

            <TouchableOpacity className="w-full">
              <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                <MaterialCommunityIcons
                  name="account-music"
                  size={20}
                  color="white"
                />
                <Text className="text-white flex-grow text-[15px]">
                  Mở danh sách
                </Text>
              </BottomSheetView>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{handleDeletePlaylist(data.Playlist_ID)}} className="w-full">
              <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                <AntDesign name="delete" size={20} color="white" />
                <Text className="text-white flex-grow text-[15px]">
                  Xóa playlist
                </Text>
              </BottomSheetView>
            </TouchableOpacity>

            <TouchableOpacity className="w-full">
              <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                <MaterialIcons name="info" size={24} color="white" />
                <Text className="text-white flex-grow text-[15px]">
                  Xem thông tin bài hát
                </Text>
              </BottomSheetView>
            </TouchableOpacity>

            <TouchableOpacity className="w-full">
              <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                <Entypo
                  name="arrow-with-circle-right"
                  size={20}
                  color="white"
                />
                <Text className="text-white flex-grow text-[15px]">
                  Ghim danh sách phát
                </Text>
              </BottomSheetView>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});

export default BottomSheetPlaylist;

const styles = StyleSheet.create({});
