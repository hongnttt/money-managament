import {Image, StyleSheet} from 'react-native';
import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ImportantTransaction from '../Transaction/ImportantTransaction';
import Transaction from '../Transaction/Transactions';
const Tab = createBottomTabNavigator();
import MyDrawer from '../Auth/Drawer';
export default function BottomTabs({navigation, route}) {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: 'red',
        tabBarInactiveTintColor: '#767c85',
      }}
      initialRouteName="Transaction">
      <Tab.Screen
        options={{
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                tintColor={color}
                style={{width: size, height: size}}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
                }}
              />
            );
          },
          title: 'Thu chi',
        }}
        name="Transaction"
        component={Transaction}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                tintColor={color}
                style={{width: size, height: size}}
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/105/105220.png',
                }}
              />
            );
          },
          title: 'Thu chi quan trọng',
        }}
        name="ImportantTransaction"
        component={ImportantTransaction}
      />
      <Tab.Screen
        options={{
          tabBarIcon: ({focused, color, size}) => {
            return (
              <Image
                tintColor={color}
                style={{width: size, height: size}}
                source={{
                  uri: 'https://icons.veryicon.com/png/o/miscellaneous/administration/account-25.png',
                }}
              />
            );
          },
          title: 'Cá nhân',
        }}
        name="MyDrawer"
        component={MyDrawer}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
