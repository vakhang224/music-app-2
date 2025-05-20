import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expireDate, setExpireDate] = useState(null);
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const refresh = await AsyncStorage.getItem("refreshToken");
        const expire = await AsyncStorage.getItem("expireDate");
        if (token && refresh && expire) {
          setAccessToken(token);
          setRefreshToken(refresh);
          setExpireDate(new Date(expire));
        }
      } catch (error) {
        console.log("Error loading tokens", error);
      }
    };
    loadToken();
  }, []);

useEffect(() => {
  const interval = setInterval(() => {
    refreshTokenIfNeeded();
  }, 5 * 60 * 1000); 

  return () => clearInterval(interval);
}, [accessToken, refreshToken, expireDate]);

  const login = async ({ token, refreshToken, expireDate }) => {
    setAccessToken(token);
    setRefreshToken(refreshToken);
    setExpireDate(new Date(expireDate));

    await AsyncStorage.setItem("token", token);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("expireDate", expireDate);
  };

  const logout = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setExpireDate(null);

    await AsyncStorage.multiRemove(["token", "refreshToken", "expireDate"]);
  };

  const refreshTokenIfNeeded = async () => {
    const now = new Date();
    const expire = new Date(expireDate);

    if (!accessToken || !refreshToken || !expireDate) return;

   
    if (expire.getTime() - now.getTime() >5*60*1000) return;

    try {
      const response = await fetch(`http://192.168.1.116:3000/account/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        await login({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          expireDate: data.expireDate,
        });
      } else {
        Alert.alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");
        logout();
      }
    } catch (err) {
      console.log("Error refreshing token", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        refreshToken,
        expireDate,
        login,
        logout,
        refreshTokenIfNeeded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );c
};

export const useAuth = () => useContext(AuthContext);
