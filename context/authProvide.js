import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expireDate, setExpireDate] = useState(null);
  const [userData, setUserData] = useState(null);

  // Load dữ liệu token và userData khi app khởi động
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const refresh = await AsyncStorage.getItem("refreshToken");
        const expire = await AsyncStorage.getItem("expireDate");
        const userDataString = await AsyncStorage.getItem("userData");

        if (token && refresh && expire) {
          setAccessToken(token);
          setRefreshToken(refresh);
          setExpireDate(new Date(expire));
        }

        if (userDataString) {
          setUserData(JSON.parse(userDataString));
        }
      } catch (error) {
        console.log("Error loading storage", error);
      }
    };
    loadStorage();
  }, []);

  // Tự động refresh token mỗi 5 phút nếu gần hết hạn
  useEffect(() => {
    const interval = setInterval(() => {
      refreshTokenIfNeeded();
    }, 5 * 60 * 1000); // 5 phút

    return () => clearInterval(interval);
  }, [accessToken, refreshToken, expireDate, userData]);

  // Hàm đăng nhập lưu token + userData
  const login = async ({ token, refreshToken, expireDate, userData }) => {
    setAccessToken(token);
    setRefreshToken(refreshToken);
    setExpireDate(new Date(expireDate));
    setUserData(userData);
    console.log("Đăng nhập thành công:", userData);

    try {
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("refreshToken", refreshToken);
      await AsyncStorage.setItem("expireDate", expireDate);
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (err) {
      console.log("Error saving login data", err);
    }
  };

  // Hàm logout xóa hết dữ liệu
  const logout = async () => {
    setAccessToken(null);
    setRefreshToken(null);
    setExpireDate(null);
    setUserData(null);

    try {
      await AsyncStorage.multiRemove(["token", "refreshToken", "expireDate", "userData"]);
    } catch (err) {
      console.log("Error clearing storage", err);
    }
  };

  // Hàm refresh token khi cần thiết
  const refreshTokenIfNeeded = async () => {
    if (!accessToken || !refreshToken || !expireDate) return;

    const now = new Date();
    const expire = new Date(expireDate);

    // Nếu token còn hạn trên 5 phút thì không refresh
    if (expire.getTime() - now.getTime() > 5 * 60 * 1000) return;

    try {
      const response = await fetch(`http://192.168.1.116:3000/account/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();

        // Gọi lại login để cập nhật token mới, giữ userData hiện tại
        await login({
          token: data.accessToken,
          refreshToken: data.refreshToken,
          expireDate: data.expireDate,
          userData: userData,
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
        userData,
        login,
        logout,
        refreshTokenIfNeeded,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
