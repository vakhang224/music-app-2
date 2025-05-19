import { View, Text } from 'react-native'
import React, { useContext } from 'react'
import { Tabs } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import Entypo from '@expo/vector-icons/Entypo'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import FontAwesome5 from '@expo/vector-icons/FontAwesome5'
import AntDesign from '@expo/vector-icons/AntDesign'
import { ThemeProvider, ThemeContext } from '@/theme/ThemeContext'
import { ProfileProvider } from '@/components/ProfileContext'

const TabsLayout = () => {
  const { isDarkMode } = useContext(ThemeContext)
  const activeColor = isDarkMode ? 'white' : '#000099'
  const inactiveColor = isDarkMode ? 'gray' : 'black'

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
                            color={focused ? activeColor : inactiveColor}
                            className="w-6 h-6 mb-1 mt-7" 
                    />
                    {/* <Image
                    source={require('..\\assets\\icons\\home.png')}
                    tintColor={focused ? 'white' : 'gray'}
                    className="w-6 h-6 mb-1 mt-7" //  w-6 h-6 is close to 24x24,  mb-1 for margin
                    /> */}
                    <Text
                            className="text-sm w-20 text-center"
                            style={{ color: focused ? activeColor : inactiveColor }}> 
                            Home
                    </Text>
                  </View>
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
                                    color={focused ? activeColor : inactiveColor}
                                    className="w-6 h-6 mb-1 mt-7" />
                    {/* <Image
                    source={require('..\\assets\\icons\\library.png')}
                    tintColor={focused ? 'white' : 'gray'}
                    className="w-6 h-6 mb-1 mt-7" //  w-6 h-6 is close to 24x24,  mb-1 for margin
                    /> */}
                    <Text
                            className="text-sm w-20 text-center"
                            style={{ color: focused ? activeColor : inactiveColor }}> 
                            Library
                    </Text>
                  </View>
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
                                    color={focused ? activeColor  : inactiveColor}
                                    className="w-6 h-6 mb-1 mt-7" />
                    {/* <Image
                    source={require('..\\assets\\icons\\search.png')}
                    tintColor={focused ? 'white' : 'gray'}
                    className="w-6 h-6 mb-1 mt-7" //  w-6 h-6 is close to 24x24,  mb-1 for margin
                    /> */}
                    <Text
                            className="text-sm w-20 text-center"
                            style={{ color: focused ? activeColor : inactiveColor }}> 
                            Search
                    </Text>
                  </View>
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
                                color={focused ? activeColor  : inactiveColor} 
                                className="w-6 h-6 mb-1 mt-7"
                                />
                    {/* <Image
                    source={require('..\\assets\\icons\\options.png')}
                    tintColor={focused ? 'white' : 'gray'}
                    className="w-6 h-6 mb-1 mt-7" //  w-6 h-6 is close to 24x24,  mb-1 for margin
                    /> */}
                    <Text
                            className="text-sm w-20 text-center"
                            style={{ color: focused ? activeColor : inactiveColor }}> 
                            Setting
                    </Text>
                  </View>
                ),
                
            }}
        />
        <Tabs.Screen
            name="song/[id]"
            options={{
                headerShown: false, // Ẩn header
                tabBarShowLabel: false, // Ẩn nhãn tab
                href: null, // Nếu không muốn sử dụng đường dẫn, có thể giữ nguyên hoặc sửa lại
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
              }}
        />
        <Tabs.Screen
            name="album/[id]"
            options={{
                headerShown: false, // Ẩn header
                tabBarShowLabel: false, // Ẩn nhãn tab
                href: null, // Nếu không muốn sử dụng đường dẫn, có thể giữ nguyên hoặc sửa lại
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
            name="artists/[id]"
            options={{
                headerShown: false, // Ẩn header
                tabBarShowLabel: false, // Ẩn nhãn tab
                href: null, // Nếu không muốn sử dụng đường dẫn, có thể giữ nguyên hoặc sửa lại
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
        
    </Tabs>
  )
}

const _layout = () => (


    <TabsLayout />

)

export default _layout