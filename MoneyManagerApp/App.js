import {StyleSheet, Text, View, SafeAreaView, TextInput} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import Login from './src/screen/Auth/Login';
// import MealMenu from './src/screen/MealMenu';
// import Counter from './src/screen/Counter';
import {createStackNavigator} from '@react-navigation/stack';
import BottomTabs from './src/screen/Tab/BottomTab';
import DetailTransaction from './src/screen/Transaction/DetailTransaction';
// import BottomTabs from './src/screen/BottomTabs';
export default function App() {
  const MainStack = createStackNavigator();
  const LoginStack = createStackNavigator();
  const SplashStack = createStackNavigator(); // Màn hình chờ

  return (
    <NavigationContainer>
      <MainStack.Navigator screenOptions={{headerShown: false}}>
        {/* <MainStack.Screen
          options={{headerShown: false}}
          name="BottomTabs"
          component={BottomTabs}></MainStack.Screen> */}
        <MainStack.Screen name="Login" component={Login}></MainStack.Screen>

        <MainStack.Screen
          name="BottomTabs"
          component={BottomTabs}></MainStack.Screen>

        <MainStack.Screen
          name="DetailTransaction"
          component={DetailTransaction}></MainStack.Screen>
      </MainStack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
