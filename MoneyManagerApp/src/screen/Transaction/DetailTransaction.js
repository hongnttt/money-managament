import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useRef, useEffect} from 'react';
import FormAddItem from './FormAddItem';
import ModelBox from 'react-native-modalbox';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL, END_POINT} from '../../api/api';
import {TRANSACTION_TYPE} from '../../utils/constant';

const {width} = Dimensions.get('window');

export default function DetailTransaction({navigation, route}) {
  const detailData = route?.params?.food;
  const id = detailData?.id;
  const [itemEdit, setItemEdit] = useState();
  const [transactionType, setTransactionType] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const addItemRef = useRef(null);

  useEffect(() => {
    if (id) {
      getDetailFromApi();
    }
  }, [id]);

  const getDetailFromApi = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(BASE_URL + END_POINT.getDetail + id);
      const resDetail = await res?.json();
      setItemEdit(resDetail);
      setTransactionType(resDetail?.transactions_type);
      setIsLoading(false);
    } catch (error) {
      console.log('error:', error);
      setIsLoading(false);
    }
  };

  const reset = () => {
    setItemEdit(null);
  };
  const handleGoBack = () => {
    navigation.goBack();
    reset();
  };

  const handleEdit = () => {
    addItemRef?.current?.open();
  };

  const onCancel = () => {
    addItemRef?.current?.close();
  };

  const onUpdateItem = (id, dtUpdate) => {
    setItemEdit({
      ...itemEdit,
      note: dtUpdate?.note,
      transactions_type: dtUpdate?.transactions_type,
      amount: dtUpdate?.amount,
    });
    setTransactionType(dtUpdate?.transactions_type);
    route.params.onUpdateItem(id, dtUpdate);
    onCancel();
  };

  const getDataByKey = async key => {
    try {
      const jsonValue = await AsyncStorage.getItem(key);
      return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
      // error reading value
    }
  };

  const handleSaveLike = async () => {
    try {
      const dataByKey = await getDataByKey('saveLike');
      let newData = [];
      if (dataByKey) {
        newData = [...dataByKey];
      }

      const isExsist = newData?.some(
        i => i?.id == itemEdit?.id && i?.note == itemEdit?.note,
      );
      if (isExsist) {
        Alert.alert('Thông báo', 'Thu chi đã được thêm', [
          {
            text: 'Đóng',
          },
        ]);
        return;
      } else {
        newData.push(itemEdit);
        const jsonValue = JSON.stringify(newData);
        await AsyncStorage.setItem('saveLike', jsonValue);

        Alert.alert('Thông báo', 'Thêm thành công', [
          {
            text: 'OK',
          },
        ]);
      }
    } catch (e) {
      console.log('e:', e);
    }
  };

  const color = transactionType == 'income' ? 'green' : 'red';
  const type = TRANSACTION_TYPE?.find(x => x?.value === transactionType);

  return (
    <>
      {isLoading ? (
        <>
          <View>
            <ActivityIndicator color={'red'} size={'large'} />
          </View>
        </>
      ) : (
        <View style={styles.container}>
          <TouchableOpacity style={styles.buttonBack} onPress={handleGoBack}>
            <Text style={styles.buttonIcon}>{'<'}</Text>
          </TouchableOpacity>
          <View style={styles.itemInfo}>
            <Text style={styles.note}>{itemEdit?.note}</Text>
            <Text style={styles.text}>Loại thu chi: {type?.label}</Text>
            <Text style={styles.text}>Ngày: {itemEdit?.date}</Text>
            <Text style={styles.text}>Danh mục: {itemEdit?.category}</Text>
            <Text style={{marginTop: 8}}>
              Số tiền:{' '}
              <Text style={{color: color, fontSize: 16}}>
                {itemEdit?.amount}
              </Text>
            </Text>
          </View>
          <View style={styles.button}>
            <TouchableOpacity
              style={styles.buttonStyles}
              onPress={handleSaveLike}>
              <Text style={{fontSize: 18, color: '#fff'}}>
                Lưu thu chi quan trọng
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.buttonEdit}>
            <TouchableOpacity style={styles.buttonStyles} onPress={handleEdit}>
              <Text style={{fontSize: 18, color: '#333'}}>Chỉnh sửa</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <ModelBox
        ref={addItemRef}
        position="bottom"
        style={{height: 500}}
        onClosed={onCancel}>
        <FormAddItem
          editData={itemEdit}
          onCancel={onCancel}
          onEditItem={onUpdateItem}
        />
      </ModelBox>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: 'column',
    padding: 20,
  },
  transactionType: {
    height: 300,
  },
  note: {
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  typeMealItem: {
    fontSize: 16,
  },
  date: {
    fontSize: 16,
    marginTop: 10,
  },
  buttonStyles: {
    padding: 8,
  },
  buttonIcon: {
    fontSize: 20,
    color: 'red',
  },
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
    marginTop: 10,
    borderRadius: 30,
  },
  buttonEdit: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e3b639',
    marginTop: 10,
    borderRadius: 30,
  },
  buttonBack: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 4,
    left: 4,
    backgroundColor: '#bdbdbd',
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  text: {
    fontSize: 15,
    marginTop: 6,
  },
  itemInfo: {
    margin: 10,
  },
});
