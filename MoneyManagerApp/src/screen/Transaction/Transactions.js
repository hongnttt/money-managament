import {
  Button,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Dimensions,
  TouchableOpacity,
  Model,
  Alert,
} from 'react-native';
import React, {useState, useEffect, useRef, useCallback} from 'react';
import TransactionItem from './TransactionItem';
import ModelBox from 'react-native-modalbox';
import FormAddItem from './FormAddItem';
import {BASE_URL, END_POINT} from '../../api/api';

const {width} = Dimensions.get('window');
export default function Transaction({navigation, route}) {
  const [filterData, setFilterData] = useState([]);
  const [search, setSearch] = useState('');
  const [isRefeshing, setIsRefeshing] = useState(false);
  const [itemEdit, setItemEdit] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const addItemRef = useRef(null);
  // const navi = useNavigation(); //= navigation

  useEffect(() => {
    getDataFromApiAsync();
    setItemEdit(null)
  }, [search]);

  const handleOpenAddModel = () => {
    addItemRef?.current?.open();
  };

  const onCancel = () => {
    setItemEdit(null);
    addItemRef?.current?.close();
  };

  const onAddItem = async newItem => {
    try {
      const res = await fetch(BASE_URL + END_POINT.insert, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      const response = await res.json();
      if (response?.status === 200) {
        Alert.alert('Thông báo', 'Thêm thành công', [
          {
            text: 'Đóng',
            onPress: async () => {
              onCancel();
            },
          },
        ]);
        getDataFromApiAsync();
      } else {
        Alert.alert('Thông báo', `${response?.message}`, [
          {
            text: 'Đóng',
          },
        ]);
      }
    } catch (error) {
      console.log('error:', error);
    }
  };

  const handleRemoveItem = id => {
    Alert.alert('Thông báo', 'Bạn có muốn xoá?', [
      {
        text: 'Không',
        style: 'cancel',
      },
      {
        text: 'Đồng ý',
        onPress: async () => {
          const res = await fetch(BASE_URL + END_POINT.delete + id, {
            method: 'DELETE',
          });
          const resResult = await res.json();
          setFilterData(resResult?.data?.transactions);
          setTotalAmount(resResult?.data?.total_expenses);
        },
      },
    ]);
  };

  const getDataFromApiAsync = async () => {
    try {
      const res = await fetch(BASE_URL + END_POINT.getData + search?.trim());
      const json = await res?.json();
      const dataResult = json?.data?.transactions || [];
      setFilterData(dataResult);
      setTotalAmount(json?.data?.total_expenses || 0);
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdateItem = async (id, dtUpdate) => {
    const res = await fetch(BASE_URL + END_POINT.update + id, {
      method: 'PUT',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dtUpdate),
    });
    const resUpdate = await res.json();

    setFilterData(resUpdate?.data?.transactions || []);
    setTotalAmount(resUpdate?.data?.total_expenses);
    onCancel();
  };

  const handleViewDetail = item => {
    navigation.navigate('DetailTransaction', {
      food: item,
      onUpdateItem: (id, dtUpdate) => onUpdateItem(id, dtUpdate),
    });
  };

  const onRefreshing = () => {
    setIsRefeshing(true);
    setTimeout(() => {
      setIsRefeshing(false);
      getDataFromApiAsync();
      setItemEdit(null);
    }, 2000);
  };

  const totalShower =
    totalAmount && totalAmount > 0 ? `+${totalAmount}` : totalAmount;
  return (
    <>
      <View style={styles.container}>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <Text style={styles.title}>{'DANH SÁCH THU CHI'}</Text>
          <Text style={styles.totalAmount}>
            Tổng thu chi:{' '}
            <Text style={{color: totalShower >= 0 ? 'green' : 'red'}}>
              {totalShower || 0}
            </Text>
          </Text>
        </View>
        {/* <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <TextInput
            value={search}
            style={styles.input}
            // onEndEditing={}
            onChangeText={function (value) {
              setSearch(value || '');
            }}
            placeholder="Nhập để tìm kiếm"
          />
        </View> */}
        <FlatList
          // numColumns={2}
          // horizontal={true}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: 20,
              }}>
              <Text style={{color: 'red'}}>Không có dữ liệu</Text>
            </View>
          }
          data={filterData}
          keyExtractor={(item, index) => item.id.toString()}
          refreshControl={
            <RefreshControl refreshing={isRefeshing} onRefresh={onRefreshing} />
          }
          snapToAlignment="start"
          decelerationRate={'fast'}
          pagingEnabled
          renderItem={({item, index}) => (
            <TransactionItem
              item={item}
              index={index}
              handleRemoveItem={() => handleRemoveItem(item?.id)}
              handleViewDetail={() => handleViewDetail(item)}
              isDeleted={true}
            />
          )}
        />
        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={handleOpenAddModel}>
          <Text style={styles.buttonIcon}>+</Text>
        </TouchableOpacity>
      </View>
      <ModelBox
        ref={addItemRef}
        position="bottom"
        style={{height: 500}}
        onClosed={onCancel}>
        <FormAddItem
          onCancel={onCancel}
          onAddItem={onAddItem}
          onEditItem={onUpdateItem}
          editData={itemEdit}
        />
      </ModelBox>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'aliceblue',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  input: {
    height: 40,
    marginTop: 20,
    borderWidth: 1,
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 6,
    color: '#333',
  },
  buttonStyles: {
    width: 44,
    height: 44,
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#008080',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    fontSize: 30,
    color: '#fff',
  },
  totalAmount: {
    fontSize: 18,
    color: '#200b72',
  },
});
