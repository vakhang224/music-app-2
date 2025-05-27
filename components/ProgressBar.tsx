import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { usePlayerStore } from '@/store/usePlayerStore';
const formatTime = (millis: number) => {
  const totalSeconds = Math.floor(millis / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

export default function ProgressBar() {
  const { position, duration,  seekTo,setIsSeeking } = usePlayerStore();

  return (
    <View className='w-full'>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        onSlidingComplete={(value)=>{seekTo(value),setIsSeeking(true)}}
        minimumTrackTintColor="#1DB954" 
        maximumTrackTintColor="#ccc"
        thumbTintColor="#1DB954"
        disabled={duration === 0}
      />
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{formatTime(position)}</Text>
        <Text style={styles.timeText}>{formatTime(duration)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  timeContainer: {   
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  timeText: {
    fontSize: 12,
    color: '#555',
  },
});
