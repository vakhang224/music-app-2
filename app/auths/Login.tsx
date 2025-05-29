import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import * as Linking from "expo-linking";
import { router } from "expo-router";

const Login = () => {
  return (
    <View className="w-full flex flex-col justify-center items-center h-full bg-gray-900">
        <View className="flex flex-col justify-center items-center p-4 gap-4">
          <Text className="text-white font-bold text-5xl text-center">
            WELCOME TO LOGIN
          </Text>
          <Image
      source={require('../assets/images/bocchi.jpg')}
            className="rounded-full bg-white w-20 h-20"
          />
          <Text className="text-white text-xl text-center">
            What are you waiting for?{"\n"} Come here and chilling with us
          </Text>
        </View>
  
    <View className="login w-[80%] flex gap-2">
          <View className="w-full">
          <TouchableOpacity
            className="bg-pink-400 p-4 rounded-full"
            onPress={()=>{router.push("/auths/SignIn")}}
          >
            <Text className="text-white text-center font-bold">
              Login with Email
            </Text>
          </TouchableOpacity>
        </View>

        <View className="w-full">
          <TouchableOpacity
            className="bg-white p-4 rounded-full"
            onPress={()=>{router.replace("/(tabs)/home")}}
          >
            <Text className="text-center font-bold">
              Login with google
            </Text>
          </TouchableOpacity>
        </View>
    </View>

      <View className="p-3">


        <Text className="text-white">Don't have an account?</Text>
        <TouchableOpacity
          className=" p-2 rounded-full"
          onPress={()=>{router.push("/auths/SignUp")}}
        >
          <Text className="text-center font-bold text-white">
            Sign Up
          </Text>
        </TouchableOpacity>

      </View>
      </View>
  );
};

export default Login;
