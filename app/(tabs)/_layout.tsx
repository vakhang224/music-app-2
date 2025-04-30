import { View, Text, ImageBackground, ImageBase, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import AntDesign from '@expo/vector-icons/AntDesign';


const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name="index"
            options={{
                headerShown:false,
                tabBarShowLabel: false,
                // tabBarActiveTintColor: 'white',
                // tabBarInactiveTintColor: 'grey',
                tabBarStyle: {
                    height: 60,
                    marginTop: -100,
                    marginBottom: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    shadowOpacity: 0,
                    elevation: 0,
                },
                tabBarIcon: ({ focused }) => (
                    <View className="flex w-full h-full items-center justify-center flex-1 ">
                    <Entypo name="home" 
                            size={20} 
                            color={focused ? 'white' : 'gray'}
                            className="w-6 h-6 mb-1 mt-7" //  w-6 h-6 is close to 24x24,  mb-1 for margin
                    />
                    {/* <Image
                    source={require('..\\assets\\icons\\home.png')}
                    tintColor={focused ? 'white' : 'gray'}
                    className="w-6 h-6 mb-1 mt-7" //  w-6 h-6 is close to 24x24,  mb-1 for margin
                    /> */}
                    <Text className={`text-sm w-20 ${focused ? 'text-white' : 'text-gray-400'} text-center`}>
                        Home
                    </Text>
                  </View>
                ),
                tabBarBackground:() => (
                    <LinearGradient
                    colors={['rgba(0, 0, 0, 1)', 'rgba(255, 174, 0, 0)']}
                    start={{ x: 0, y: 1 }} // 0deg in CSS starts from bottom
                    end={{ x: 0, y: 0 }}   // and goes to top
                    style={{flex: 1}}
                    />
                ),
            }}
        />
        <Tabs.Screen
            name="library"
            options={{
                headerShown:false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60,
                    marginTop: -100,
                    marginBottom: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    shadowOpacity: 0,
                    elevation: 0,
                },
                tabBarIcon: ({ focused }) => (
                    <View className="flex w-full h-full items-center justify-center flex-1 ">
                    <MaterialIcons  name="library-music" 
                                    size={20} 
                                    color={focused ? 'white' : 'gray'}
                                    className="w-6 h-6 mb-1 mt-7" />
                    {/* <Image
                    source={require('..\\assets\\icons\\library.png')}
                    tintColor={focused ? 'white' : 'gray'}
                    className="w-6 h-6 mb-1 mt-7" //  w-6 h-6 is close to 24x24,  mb-1 for margin
                    /> */}
                    <Text className={`text-sm w-20 ${focused ? 'text-white' : 'text-gray-400'} text-center`}>
                        Library
                    </Text>
                  </View>
                ),
                tabBarBackground:() => (
                    <LinearGradient
                    colors={['rgba(0, 0, 0, 1)', 'rgba(255, 174, 0, 0)']}
                    start={{ x: 0, y: 1 }} // 0deg in CSS starts from bottom
                    end={{ x: 0, y: 0 }}   // and goes to top
                    style={{flex: 1}}
                    />
                ),
            }}
        />
        <Tabs.Screen
            name="search"
            options={{
                headerShown:false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60,
                    marginTop: -100,
                    marginBottom: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    shadowOpacity: 0,
                    elevation: 0,
                },
                tabBarIcon: ({ focused }) => (
                    <View className="flex w-full h-full items-center justify-center flex-1 ">
                    <FontAwesome5   name="search" 
                                    size={18} 
                                    color={focused ? 'white' : 'gray'}
                                    className="w-6 h-6 mb-1 mt-7" />
                    {/* <Image
                    source={require('..\\assets\\icons\\search.png')}
                    tintColor={focused ? 'white' : 'gray'}
                    className="w-6 h-6 mb-1 mt-7" //  w-6 h-6 is close to 24x24,  mb-1 for margin
                    /> */}
                    <Text className={`text-sm w-20 ${focused ? 'text-white' : 'text-gray-400'} text-center`}>
                        Search
                    </Text>
                  </View>
                ),
                tabBarBackground:() => (
                    <LinearGradient
                    colors={['rgba(0, 0, 0, 1)', 'rgba(255, 174, 0, 0)']}
                    start={{ x: 0, y: 1 }} // 0deg in CSS starts from bottom
                    end={{ x: 0, y: 0 }}   // and goes to top
                    style={{flex: 1}}
                    />
                ),
            }}
        />
        <Tabs.Screen
            name="setting"
            options={{
                headerShown:false,
                tabBarShowLabel: false,
                tabBarStyle: {
                    height: 60,
                    marginTop: -100,
                    marginBottom: 0,
                    backgroundColor: 'transparent',
                    borderTopWidth: 0,
                    borderBottomWidth: 0,
                    shadowOpacity: 0,
                    elevation: 0,
                },
                tabBarIcon: ({ focused }) => (
                    <View className="flex w-full h-full items-center justify-center flex-1 ">
                    <AntDesign  name="setting" 
                                size={20} 
                                color={focused ? 'white' : 'gray'} 
                                className="w-6 h-6 mb-1 mt-7"
                                />
                    {/* <Image
                    source={require('..\\assets\\icons\\options.png')}
                    tintColor={focused ? 'white' : 'gray'}
                    className="w-6 h-6 mb-1 mt-7" //  w-6 h-6 is close to 24x24,  mb-1 for margin
                    /> */}
                    <Text className={`text-sm w-20 ${focused ? 'text-white' : 'text-gray-400'} text-center`}>
                        Setting
                    </Text>
                  </View>
                ),
                tabBarBackground:() => (
                    <LinearGradient
                    colors={['rgba(0, 0, 0, 1)', 'rgba(255, 174, 0, 0)']}
                    start={{ x: 0, y: 1 }} // 0deg in CSS starts from bottom
                    end={{ x: 0, y: 0 }}   // and goes to top
                    style={{flex: 1}}
                    />
                ),
            }}
        />
        <Tabs.Screen
            name="song/[id]"
            options={{
                headerShown: false, // Ẩn header
                tabBarShowLabel: false, // Ẩn nhãn tab
                tabBarStyle: {
                  display: 'none', // Ẩn tabBar
                },
                href: null, // Nếu không muốn sử dụng đường dẫn, có thể giữ nguyên hoặc sửa lại
              }}
        />
        <Tabs.Screen
            name="album/[id]"
            options={{
                headerShown: false, // Ẩn header
                tabBarShowLabel: false, // Ẩn nhãn tab
                tabBarStyle: {
                  display: 'none', // Ẩn tabBar
                },
                href: null, // Nếu không muốn sử dụng đường dẫn, có thể giữ nguyên hoặc sửa lại
              }}
        />
    </Tabs>
  )
}

export default _layout