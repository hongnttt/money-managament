import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
  } from 'react-native';
  import React from 'react';
  const {width, height} = Dimensions.get('window');
  
  export default function CustomButton({buttonText, onPress, buttonStyles}) {
    // function handlePress() {
  
    // }
    return (
      <TouchableOpacity style={buttonStyles} onPress={onPress}>
        <Text style={{fontSize: 16, color: '#fff'}}>{buttonText}</Text>
      </TouchableOpacity>
    );
  }
  
  const styles = StyleSheet.create({
    customButton: {
      height: 40,
      backgroundColor: '#40ffc6',
      width: width - 100,
      borderRadius: 10,
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: 10,
    },
  });
  