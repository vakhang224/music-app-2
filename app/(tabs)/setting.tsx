import React from 'react';
import { View, Image, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

const setting = () => {
  const profileImage = require('@/assets/images/profile.webp');

  return (
    <View className='absolute w-full z-0 h-full bg-[#c0c0c0]'>
      <ScrollView style={{ marginTop: 2 }}> {/* Tăng marginTop để có khoảng cách */}

        <View style={styles.profileContainer}>
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
});

export default setting;