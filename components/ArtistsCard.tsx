import { View, Text, Image } from 'react-native'
import React from 'react'
import "@/app/global.css";

const ArtistsCard = () => {
  return (
    <View style={{width: "45%",height: "25%", marginLeft: 10, borderColor: "white", borderWidth: 1, borderRadius: 5}}>
        <Image  source={require("@/assets/dataImage/sontung.jpg")}
                style={{
                    maxWidth:"30%",
                    height: "100%",
                    borderRadius: 5
                }}
                />
        <Text className="text-white">Sơn Tùng M-TP</Text>
    </View>
  )
}

export default ArtistsCard