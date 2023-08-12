import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';

const {width} = Dimensions.get('window');
export default function TransactionItem({
  item,
  index,
  handleRemoveItem = () => {},
  handleViewDetail = () => {},
  isDeleted,
}) {
  const color = item?.transactions_type == 'income' ? 'green' : 'red';
  const amount =
    item?.transactions_type == 'income'
      ? `+${item?.amount || 0}`
      : `-${item?.amount || 0}`;
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleViewDetail} key={index}>
        <View
          style={{
            flexDirection: 'row',
            borderBottomWidth: 0.8,
            borderColor: '#c02eb8',
            justifyContent: 'center',
            alignItem: 'center',
          }}>
          <View style={{flex: 1.0}}>
            <View>
              <View style={styles.itemInfo}>
                <Text style={styles.name}>{item?.note}</Text>
                <Text style={styles.text}>Ngày: {item?.date}</Text>
                <Text style={styles.text}>Danh mục: {item?.category}</Text>
              </View>
            </View>
          </View>
          <View style={{flex: 0.4}}>
            <View style={styles.amount}>
              <Text style={{color: color, fontSize: 18, marginTop: 10}}>
                {amount}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      {isDeleted && (
        <TouchableOpacity
          style={styles.buttonStyles}
          onPress={handleRemoveItem}>
          <View style={styles.buttonIcon}>
            <Text style={{color: '#333', fontSize: 13, color: 'red'}}>Xóa</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // width: width - 40,
    // flexDirection: 'row',
    borderRadius: 5,
    // borderBottomWidth: 1,
    justifyContent: 'center',
    alignItem: 'center',
    // borderColor: '#c02eb8',
    // flex: 1,
    marginLeft: 20,
    marginRight: 20,
  },
  imgUrl: {
    height: 100,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#064c84',
  },
  typeMealItem: {
    fontSize: 16,
  },
  text: {
    fontSize: 15,
    marginTop: 6,
  },
  itemInfo: {
    margin: 10,
  },
  amount: {
    margin: 10,
    alignItems: 'flex-end',
  },
  buttonStyles: {
    width: 40,
    height: 24,
    position: 'absolute',
    bottom: 10,
    right: 10,
    // backgroundColor: '#bdbdbd',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    // zIndex: 10,
  },
  buttonIcon: {
    fontSize: 20,
    // color: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    // zIndex: 12,
  },
  money: {
    color: 'green',
  },
});
