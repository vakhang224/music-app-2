import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
import { AntDesign, Entypo, MaterialIcons } from '@expo/vector-icons';
import { Artist } from '@/interface/databaseModel';
import { useAuth } from '@/context/authProvide';
import { router } from 'expo-router';

type Props = {
  data: Artist;
  onSuccess: () => void;
};

export type bottomSheetArtistRef = {
  open: () => void;
  close: () => void;
};

const BottomSheetArtist = forwardRef(({ data, onSuccess }: Props, ref) => {
  const snapPoints = useMemo(() => ['50%', '100%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const {accessToken,refreshTokenIfNeeded} = useAuth()
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(1),
    close: () => bottomSheetRef.current?.close(),
  }));

  const handleRemoveArtist = async (id: string) => {
    try {
      await refreshTokenIfNeeded()
      // Gọi API xoá nghệ sĩ khỏi thư viện (cần cập nhật route phù hợp)
      const res = await fetch(`${process.env.URL_API}/library/artist/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (res.ok) {
        alert('Đã xoá nghệ sĩ khỏi thư viện!');
        bottomSheetRef.current?.close();
        onSuccess();
      } else {
        const errorData = await res.json();
        alert(`Lỗi: ${errorData.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Có lỗi xảy ra!');
    }
  };

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
          <BottomSheetView className="flex flex-row items-center w-full gap-3 border-b border-gray-400" style={{ paddingVertical: 15 }}>
            <View className="rounded-full bg-white h-16 w-16 overflow-hidden">
              <Image
                source={{
                  uri: data.images?.[0]?.url ?? 'https://i.scdn.co/image/ab6761610000e5ebbcb1c184c322688f10cdce7a',
                }}
                className="w-full h-full"
              />
            </View>
            <Text className="text-white font-bold text-lg">{data.name}</Text>
          </BottomSheetView>

          <BottomSheetView className="flex flex-col gap-7">
            <TouchableOpacity className="w-full" onPress={()=>{router.replace({ pathname: '/artists/[id]', params: { id: data.id } })
          bottomSheetRef.current?.close()}}>
              <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                <MaterialIcons name="person" size={20} color="white" />
                <Text className="text-white flex-grow text-[15px]">
                  Xem thông tin nghệ sĩ
                </Text>
              </BottomSheetView>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleRemoveArtist(data.id)} className="w-full">
              <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                <AntDesign name="delete" size={20} color="white" />
                <Text className="text-white flex-grow text-[15px]">
                  Xoá khỏi thư viện
                </Text>
              </BottomSheetView>
            </TouchableOpacity>

            <TouchableOpacity className="w-full">
              <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                <Entypo name="info-with-circle" size={20} color="white" />
                <Text className="text-white flex-grow text-[15px]">
                  Thêm vào danh sách yêu thích
                </Text>
              </BottomSheetView>
            </TouchableOpacity>
          </BottomSheetView>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});

export default BottomSheetArtist;

const styles = StyleSheet.create({});
