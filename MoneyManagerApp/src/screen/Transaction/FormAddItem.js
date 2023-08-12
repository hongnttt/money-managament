import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Dimensions,
  Button,
} from 'react-native';
import {useState, useEffect} from 'react';
const {width} = Dimensions.get('window');
import DropDownPicker from 'react-native-dropdown-picker';
import {TRANSACTION_TYPE} from '../../utils/constant';

export default FormAddItem = ({onCancel, onAddItem, editData, onEditItem}) => {
  const [note, setNote] = useState('');
  const [amount, setAmount] = useState('');
  const [open, setOpen] = useState(false);
  const [itemSelected, setItemSelected] = useState('');
  const [date, setDate] = useState('');

  useEffect(() => {
    if (editData) {
      setNote(editData?.note || '');
      setAmount(editData?.amount?.toString());
      setItemSelected(editData?.transactions_type || '');
      setDate(editData?.date)
    }
  }, [editData]);

  const onReset = () => {
    setNote('');
    setAmount('');
    setItemSelected('');
  };

  const handleAddItem = () => {
    const payload = {
      note: note,
      amount: amount,
      date,
      transactions_type: itemSelected,
      id: Math.random(),
    };
    onReset();
    onAddItem(payload);
  };

  const handleUpdateItem = () => {
    const id = editData?.id;
    const dtUpdate = {
      note: note,
      amount: amount,
      date,
      transactions_type: itemSelected,
    };
    onEditItem(id, dtUpdate);
    // onReset();
  };

  return (
    <View style={styles.container}>
      {editData?.id ? <Text style={styles.label}>CHỈNH SỬA THU CHI</Text> : <Text style={styles.label}>THÊM MỚI THU CHI</Text>}
      <View style={styles.item}>
        <Text style={styles.label}>Loại thu chi</Text>
        <View style={{margin: 14}}>
          <DropDownPicker
            style={{width: '100%'}}
            open={open}
            value={itemSelected}
            items={TRANSACTION_TYPE}
            setOpen={open => setOpen(open)}
            onSelectItem={item => {
              setItemSelected(item?.value);
            }}
            placeholder="Chọn loại thu chi"
          />
        </View>
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Ghi chú</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập ghi chú"
          onChangeText={val => {
            setNote(val || '');
          }}
          value={note}
        />
      </View>
      <View style={styles.item}>
        <Text style={styles.label}>Số tiền</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số tiền"
          onChangeText={val => {
            setAmount(val || 0);
          }}
          value={amount}
        />
      </View>
      <View style={styles.button}>
        <View style={{marginRight: 10}}>
          <Button
            onPress={onCancel}
            title="Đóng"
            color="#bdbdbd"
            style={{margin: 40}}
          />
        </View>
        {!editData ? (
          <Button onPress={handleAddItem} title="Tạo mới" />
        ) : (
          <Button onPress={handleUpdateItem} title="Cập nhật" />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  input: {
    height: 46,
    margin: 16,
    borderWidth: 1,
    width: width - 40,
    backgroundColor: '#fff',
    borderRadius: 6,
    color: '#333',
  },
  label: {
    marginLeft: 14,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  item: {
    width: width - 10,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
});
