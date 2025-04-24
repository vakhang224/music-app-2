import { View, Text, ImageBackground, ImageBase, Image } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Colors } from '@/app-example/constants/Colors'
import { blue } from 'react-native-reanimated/lib/typescript/Colors'

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name="index"
            options={{
                headerShown:false,
                tabBarActiveBackgroundColor: "#979391",
                tabBarStyle: {
                    backgroundColor: '#3d3d3d'
                },
                tabBarIcon: ({ focused }) => (
                    <>
                        <Image 
                            source={require('..\\assets\\icons\\home.png')}
                            tintColor="white"
                        />
                    </>
                )
            }}
        />
        <Tabs.Screen
            name="library"
            options={{
                headerShown:false
            }}
        />
        <Tabs.Screen
            name="search"
            options={{
                headerShown:false
            }}
        />
        <Tabs.Screen
            name="setting"
            options={{
                headerShown:false
            }}
        />
    </Tabs>
  )
}

export default _layout