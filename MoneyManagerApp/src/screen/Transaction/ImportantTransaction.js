import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import TransactionItem from './TransactionItem';
export default function ImportantTransaction({navigation}) {
  const [listSave, setListSave] = useState([]);
  const [isRefeshing, setIsRefeshing] = useState(false);
  useEffect(() => {
    navigation.addListener('focus', () => {
      getAllDataByKey('saveLike');
    });
  }, [navigation]);

  const getDataByKey = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {}
  };

  const getAllDataByKey = async key => {
    const data = await getDataByKey(key);
    setListSave(data);
  };

  const deletedAllKey = async key => {
    Alert.alert('Thông báo', 'Bạn có muốn xóa?', [
      {
        text: 'Không',
        style: 'cancel',
      },
      {
        text: 'Đồng ý',
        onPress: async () => {
          await AsyncStorage.setItem(key, '');
          await getAllDataByKey(key);
        },
      },
    ]);
  };

  const onRefreshing = () => {
    setIsRefeshing(true);
    setTimeout(() => {
      setIsRefeshing(false);
      getDataByKey('saveLike');
    }, 2000);
  };

  return (
    <View>
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.title}>{'DANH SÁCH THU CHI QUAN TRỌNG'}</Text>
      </View>

      <View style={styles.button}>
        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={() => deletedAllKey('saveLike')}>
          <Text style={{fontSize: 18, color: '#fff'}}>Xóa tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={listSave}
        refreshControl={
          <RefreshControl refreshing={isRefeshing} onRefresh={onRefreshing} />
        }
        snapToAlignment="start"
        decelerationRate={'fast'}
        pagingEnabled
        renderItem={({item, index}) => (
          <TransactionItem item={item} index={index} isDeleted={false} />
        )}
      />
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
});
