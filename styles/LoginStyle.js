import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',

  },
  imgCon: {
    flex:1,
    alignSelf:'stretch'
  },
  preloader: {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  text: {
    fontSize:totalSize(2),
    color:'black',
    // fontWeight:'bold'
  }
});

export default styles;
