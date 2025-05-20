import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { truncateText } from "@/utils/trancateText";
interface artirst {
  id:string;
  name: string;
  image: string;
  onSelect:(id:string,isSelect:boolean)=>void;
}

const ArtistIconSelect = ({id, image, name,onSelect }: artirst) => {
  const [isSelect, setSelect] = useState(false);

  const handle=()=>{
     setSelect(!isSelect);
      onSelect(id,!isSelect)
  }
  return (
    <TouchableOpacity
      onPress={() => {
        handle()
      }}
      style={{ alignItems: "center" }}
      className="relative flex justify-center items-center"
    >
      <View
        style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          overflow: "hidden",
          marginBottom: 10,
        }}
      >
        <Image
          source={{ uri: image||"https://i.scdn.co/image/ab6761610000e5eb170428492febf4a71ef1e08e" }}
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            opacity: !isSelect ? 1 : 0.2,
          }}
        />
      </View>
      <Text
        style={{
          color: "white",
          fontWeight: "bold",
          fontSize: 16,
          overflow:"hidden",
          width:100,
          textAlign:"center"
        }}
      >
        {truncateText(name,14)}
      </Text>
      <MaterialIcons
        name="done"
        size={24}
        color="white"
        style={{
          position: "absolute",
          top: 39,
          display: isSelect ? "flex" : "none",
        }}
      />
    </TouchableOpacity>
  );
};

export default ArtistIconSelect;

const styles = StyleSheet.create({});
