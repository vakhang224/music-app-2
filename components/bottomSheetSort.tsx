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
  FontAwesome,
} from '@expo/vector-icons';
import { typeSort } from '@/interface/databaseModel';

export type bottomSheetSortRef = {
    open:()=>void;
    close:()=>void;
}

type Props = {
  onTypeSort: (type: typeSort) => void;
}

const BottomSheetSort = forwardRef<bottomSheetSortRef,Props>(({onTypeSort}:Props, ref) => {
  const snapPoints = useMemo(() => ['50%', '100%'], []);
  const bottomSheetRef = useRef<BottomSheet>(null);
  useImperativeHandle(ref, () => ({
    open: () => bottomSheetRef.current?.snapToIndex(1),
    close: () => bottomSheetRef.current?.close(),
  }));
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
        <BottomSheetView className="flex items-center flex-col gap-4 px-10 p-">
        
        <BottomSheetView className='p-4 border-b w-full border-gray-500'>
            <Text className='w-full text-center font-semibold text-xl text-white'>Sắp xếp theo</Text>
        </BottomSheetView>

          <BottomSheetView className="flex flex-col gap-7">
            <TouchableOpacity className="w-full" onPress={()=>{onTypeSort(typeSort.alphaSort)}}>
              <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                <FontAwesome
                  name="sort-alpha-asc"
                  size={20}
                  color="white"
                />
                <Text className="text-white flex-grow text-[15px]">
                  Sắp xếp theo thứ tự chữ cái
                </Text>
              </BottomSheetView>
            </TouchableOpacity>

            <TouchableOpacity className="w-full" onPress={()=>{onTypeSort(typeSort.dateSort)}}>
              <BottomSheetView className="flex flex-row gap-5 w-full items-center">
                <FontAwesome name="sort-amount-asc" size={20} color="white" />
                <Text className="text-white flex-grow text-[15px]">
                    theo thời gian gần đây
                </Text>
              </BottomSheetView>
            </TouchableOpacity>

          </BottomSheetView>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
});

export default BottomSheetSort;

const styles = StyleSheet.create({});
