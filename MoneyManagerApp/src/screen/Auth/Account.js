import {StyleSheet, Text, View, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function Account({navigation, route}) {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    checkLogin();
  }, []);

  const getDataByKey = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('e:', e);
    }
  };

  const checkLogin = async () => {
    const user = await getDataByKey('user_name');
    const pass = await getDataByKey('password');

    if (user && pass) {
      setUserName(user);
    }
  };

  const setKeySync = async key => {
    await AsyncStorage.setItem(key, '');
  };

  const handleLogout = async () => {
    Alert.alert('Thông báo', 'Bạn có muốn đăng xuất?', [
      {
        text: 'Không',
        style: 'cancel',
      },
      {
        text: 'Đồng ý',
        onPress: async () => {
          await setKeySync('user_name');
          await setKeySync('password');

          navigation.navigate('Login');
        },
      },
    ]);
  };
  return (
    <View>
      {userName && <Text style={{ fontSize: 20, padding: 20}}>{`Xin chào, ${userName || ''}!`}</Text>}
      <View style={styles.button}>
        <TouchableOpacity style={styles.buttonStyles} onPress={handleLogout}>
          <Text style={{fontSize: 18, color: '#fff'}}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonStyles: {
    padding: 8,
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    margin: 20,
    borderRadius: 30,
  },
});
