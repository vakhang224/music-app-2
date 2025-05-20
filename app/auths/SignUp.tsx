import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { CheckEmail } from "../utils/checkEmail";
import { isValidPassword } from "../utils/checkPassword";
import { URL_API } from "@env";

const SignUp = () => {
  const [seePassword, setSeePassword] = useState(true);
  const [userName, setuserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSignUp() {
    if (!userName || !email || !password || !confirmPassword) {
      setError("Please enter all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!CheckEmail(email)) {
      setError("Email is not valid.");
      return;
    }

    if (!isValidPassword(password)) {
      setError(
        "Password must contain at least 8 characters, including uppercase, lowercase, number and special character."
      );
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${URL_API}/account/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          email: email,
          password: password,
        }),
      });

      if (response.ok) {
        router.replace("/auths/SignIn");
      }else if (response.status == 403) {
        setError("Username OR Email is already exists.");
        return;
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("Error creating account:", error);
        setError("An error occurred while signing up. Please try again.");
      }
    } catch (e) {
      console.log("Error", e);
      setError("An error occurred while signing up. Please try again.");
    } finally {
      setLoading(false);
      setuserName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  }

  return (
    <View className="w-full h-full flex justify-center items-center bg-gray-900 relative">
      <TouchableOpacity
        onPress={() => {
          router.back();
        }}
        className="absolute top-0 left-0 p-1 bg-white m-2 rounded-full"
      >
        <MaterialIcons name="arrow-left" size={45} color={"black"} />
      </TouchableOpacity>
      <View className="flex flex-col justify-center items-center p-4 gap-4">
        <Text className="text-white font-bold text-5xl text-center">
          SIGN UP
        </Text>
        <Image
          source={require("D:\\AppReactNative\\music-app-2\\app\\assets\\images\\bg_bocchi.png")}
          className="rounded-full bg-white w-20 h-20"
        />
      </View>

      {error ? (
        <Text
          className="italic text-center text-md font-bold"
          style={{ color: "red" }}
        >
          <MaterialIcons name="error" color="red" /> {error}
        </Text>
      ) : (
        ""
      )}

      {!loading ? (
        <View className="Login w-[80%] gap-3">
          <View className="w-full gap-2">
            <Text className="text-white italic text-sm font-bold">
              UserName
            </Text>
            <TextInput
              className="bg-white p-4 rounded-md text-black"
              placeholder="Username"
              placeholderTextColor="#000000"
              multiline={false}
              numberOfLines={1}
              onChangeText={setuserName}
            />
          </View>

          <View className="w-full gap-2">
            <Text className="text-white italic text-sm font-bold">Email</Text>
            <TextInput
              className="bg-white p-4 rounded-md text-black"
              placeholder="Email"
              placeholderTextColor="#000000"
              multiline={false}
              numberOfLines={1}
              onChangeText={setEmail}
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
              secureTextEntry={seePassword}
              multiline={false}
              numberOfLines={1}
              passwordRules={
                "minlength: 8; required: upper; required: lower; required: digit; required: special;"
              }
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => {
                setSeePassword(!seePassword);
              }}
              className="absolute"
              style={{ right: 10, top: 36 }}
            >
              <AntDesign
                name={seePassword ? "eye" : "eyeo"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
          <View className="w-full gap-2">
            <Text className="text-white text-sm font-bold italic">
              Comfirm pasword
            </Text>
            <TextInput
              className="bg-white p-4 rounded-md text-black"
              placeholder="Comfirm password"
              placeholderTextColor="#000000"
              secureTextEntry={seePassword}
              multiline={false}
              numberOfLines={1}
              passwordRules={
                "minlength: 8; required: upper; required: lower; required: digit; required: special;"
              }
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity
              onPress={() => {
                setSeePassword(!confirmPassword);
              }}
              className="absolute"
              style={{ right: 10, top: 36 }}
            >
              <AntDesign
                name={seePassword ? "eye" : "eyeo"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-pink-400 p-4 rounded-md"
            onPress={handleSignUp}
          >
            <Text className="text-white text-center font-bold">Sign up</Text>
          </TouchableOpacity>

          <View className="p-2 w-full">
            <Text className="text-white text-center">
              I already have an account !!!
            </Text>
            <TouchableOpacity
              className=" p-2 rounded-full"
              onPress={() => {
                router.replace("/auths/SignIn");
              }}
            >
              <Text className="text-center font-bold text-white">Sign In</Text>
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

export default SignUp;

const styles = StyleSheet.create({});
