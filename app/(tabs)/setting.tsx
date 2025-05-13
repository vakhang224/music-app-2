import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';


const setting = () => {

  const [isDarkMode, setIsDarkMode] = useState(false);
  const backgroundColor = isDarkMode ? 'white' : '#c0c0c0';
  const profileImage = require('@/assets/images/profile.webp');
  
  const toggleDarkMode = () => {
    setIsDarkMode(previousState => !previousState);
  };
  

  return (
    <View className='absolute w-full z-0 h-full' style={{ backgroundColor }}>
      <ScrollView style={{ marginTop: 2 }}> {/* Tăng marginTop để có khoảng cách */}

        <View style={styles.profileContainer} > {/*className="p-20 mt-1"*/}
          <View style={styles.imageContainer}>
            <Image
              style={styles.profileImage}
              source={profileImage}
            />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.name}>Nguyễn Văn A</Text>
            <Text style={styles.info}>3 danh sách nhạc</Text>
          </View>
        </View>

        {/* Toggle background color with text and switch */}
        <View style={styles.toggleContainer}>
          <Text style={styles.toggleText}>Đổi màu nền</Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isDarkMode ? '#f4f3f4' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleDarkMode}
            value={isDarkMode}
          />
        </View>


        {/* Khung đăng xuất bây giờ là một phần của ScrollView */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  profileContainer: {
    flexDirection: 'row',       // Sắp xếp các phần tử theo hàng ngang
    alignItems: 'center',      // Căn chỉnh các phần tử theo chiều dọc ở giữa
    padding: 20,               // Thêm padding xung quanh khung
    backgroundColor: '#1E1E1E', // Màu nền cho khung (tùy chọn)
    borderRadius: 10,          // Bo tròn góc của khung (tùy chọn)
    marginHorizontal: 0,      // Thêm margin ở hai bên khung
    marginTop: 20,             // Thêm margin phía trên khung
    marginBottom: 20,         // Thêm margin phía dưới khung
     
  },
  imageContainer: {
    width: 80,                // Kích thước container hình ảnh
    height: 80,               // Kích thước container hình ảnh
    borderRadius: 40,         // Tạo hình tròn
    overflow: 'hidden',       // Ẩn các phần vượt quá border radius
    marginRight: 15,          // Khoảng cách giữa hình ảnh và chữ
  },
  profileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    flex: 1,                  // Cho phép phần chữ chiếm không gian còn lại
    justifyContent: 'center', // Căn chỉnh dọc các dòng chữ ở giữa
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: '#A9A9A9',
    marginBottom: 3,
  },
  detail: {
    fontSize: 14,
    color: '#007AFF',
  },
  logoutContainer: {
    backgroundColor: '#2C2C2C',
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20, // Thêm margin dưới nút đăng xuất
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  toggleButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    margin: 16,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    margin: 16,
    borderRadius: 8,
  },
  toggleText: {
    fontSize: 18,
  },
});

export default setting;