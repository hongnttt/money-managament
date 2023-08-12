import {
  View,
  Text,
  StyleSheet,
  TextInput,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import CustomButton from '../Component/CustomButton';
import React, {useEffect, useState} from 'react';
const {width, height} = Dimensions.get('window');
import AsyncStorage from '@react-native-async-storage/async-storage';

export default Login = ({navigation, route}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const user = await getDataByKey('user_name');
    const pass = await getDataByKey('password');

    if (user && pass) {
      navigation.navigate('BottomTabs');
    }
  };

  const getDataByKey = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      console.log('e:', e);
    }
  };

  const handlePress = async () => {
    try {
      await AsyncStorage.setItem('user_name', JSON.stringify(userName));
      await AsyncStorage.setItem('password', JSON.stringify(password));
      Alert.alert('Thông báo', 'Đăng nhập thành công', [
        {
          text: 'OK',
          onPress: async () => {
            navigation.navigate('BottomTabs');
          },
        },
      ]);
    } catch (e) {
      console.log('e:', e);
    }
  };

  return (
    <View style={styles.loginContainer}>
      <View style={styles.login}>
        <SafeAreaView>
          <TextInput
            style={styles.input}
            placeholderTextColor="#333"
            placeholder="Tên đăng nhập"
            onChangeText={value => {
              setUserName(value);
            }}
          />
          <TextInput
            placeholderTextColor="#333"
            style={styles.input}
            placeholder="Mật khẩu"
            secureTextEntry={true}
            onChangeText={value => {
              setPassword(value);
            }}
          />
        </SafeAreaView>
        <CustomButton
          buttonText={'Login'}
          onPress={handlePress}
          buttonStyles={styles.buttonLogin}
        />
      </View>
      <View style={styles.footer}>
        <Text style={{fontSize: 16}}>
          {`Dont't have an account? `}
          <Text style={{color: 'white'}}>{'SignUp'}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //   backgroundColor: 'blue',
  },
  txt: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  imgUserLogin: {
    width: 100,
    height: 100,
  },
  input: {
    height: 40,
    margin: 16,
    borderWidth: 1,
    padding: 10,
    width: width - 60,
    backgroundColor: '#fff',
    borderRadius: 6,
    color: '#333',
  },
  button: {
    backgroundColor: 'green',
    height: 40,
    width: width - 60,
    justifyContent: 'center',
    alignItems: 'center',
    color: '#fff',
    boxShadow: '10 10 5 12 lightblue',
    borderRadius: 6,
  },
  login: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 4,
  },
  footer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    fontSize: 14,
  },
  buttonLogin: {
    height: 40,
    backgroundColor: 'red',
    width: width - 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
