import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { ActivityIndicator } from "react-native";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/authProvide";
import { CheckEmail } from "../utils/checkEmail";
import { URL_API } from "@env";

const SignIn = () => {
  const { login } = useAuth();
  const [hidePassword, setHidePassword] = useState(true);
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  async function handleLogin() {
    if (!emailOrUsername || !password) {
      setError("Please enter both email/username and password.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${URL_API}/account/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: emailOrUsername,
          password: password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await login({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          expireDate: data.expireDate,
        });
        router.replace("/(tabs)/home");
      } else {
        const errorData = await response.json();
        handleErrors(response.status, errorData);
      }
    } catch (e) {
      console.log("Error", e);
      setError("An error occurred while logging in. Please try again.");
    } finally {
      setLoading(false);
      setEmailOrUsername("");
      setPassword("");
      setHidePassword(false);
    }
  }

  const handleErrors = (status: number, errorData: any) => {
    if (status === 400) {
      setError("There aren't enough information.");
    } else if (status === 401) {
      setError("Invalid username or password.");
    } else if (status === 500) {
      setError("Server error. Please try again later.");
    } else {
      setError("An unexpected error occurred.");
    }
    console.log("Error data", errorData);
  };

  return (
    <View className="w-full h-full flex justify-center items-center bg-gray-900 relative">
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-0 left-0 p-1 bg-white m-2 rounded-full"
      >
        <MaterialIcons name="arrow-left" size={45} color={"black"} />
      </TouchableOpacity>

      <View className="flex flex-col justify-center items-center p-4 gap-4">
        <Text className="text-white font-bold text-5xl text-center">
          SIGN IN
        </Text>
        <Image
          source={require("D:\\AppReactNative\\music-app-2\\app\\assets\\images\\bg_bocchi.png")}
          className="rounded-full bg-white w-20 h-20"
        />
      </View>

      {error ? (
        <Text className="italic text-center text-md" style={{ color: "red" }}>
          <MaterialIcons name="error" color="red" /> {error}
        </Text>
      ) : (
        ""
      )}

      {!loading ? (
        <View className="Login w-[80%] gap-3">
          <View className="w-full gap-2">
            <Text className="text-white italic text-sm font-bold">
              Email or userName
            </Text>
            <TextInput
              className="bg-white p-4 rounded-md text-black"
              placeholder="Email or Username"
              placeholderTextColor="#000000"
              multiline={false}
              numberOfLines={1}
              onChangeText={setEmailOrUsername}
              value={emailOrUsername}
            />
          </View>

          <View className="w-full gap-2">
            <Text className="text-white text-sm font-bold italic">
              Password
            </Text>
            <TextInput
              className="bg-white p-4 rounded-md text-black"
              placeholder="Password"
              placeholderTextColor="#000000"
              secureTextEntry={hidePassword}
              multiline={false}
              numberOfLines={1}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              onPress={() => setHidePassword(!hidePassword)}
              className="absolute"
              style={{ right: 10, top: 36 }}
            >
              <AntDesign
                name={hidePassword ? "eye" : "eyeo"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-pink-400 p-4 rounded-md mt-5"
            onPress={handleLogin}
          >
            <Text className="text-white text-center font-bold">Login</Text>
          </TouchableOpacity>

          <View className="p-2 w-full">
            <Text className="text-white text-center">
              Don't have an account?
            </Text>
            <TouchableOpacity
              className=" p-2 rounded-full"
              onPress={() => router.replace("/auths/SignUp")}
            >
              <Text className="text-center font-bold text-white">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View className="flex flex-row gap-2 items-center">
          <ActivityIndicator size="large" color="#ffffff" />
          <Text className="text-white text-center font-bold">Loading...</Text>
        </View>
      )}
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
