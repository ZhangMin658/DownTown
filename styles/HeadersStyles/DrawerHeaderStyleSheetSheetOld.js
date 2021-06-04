import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:'transparent'
  },
  overlyHeader: {
    height:height(8),
    width:width(100),
    // zIndex:1000,
    // position:'absolute',
    flexDirection:'row',
    backgroundColor: 'black',
    justifyContent:'center'
  },
  drawerBtnCon: {
    height:height(4),
    width:width(15),
    justifyContent:'center',
    alignSelf:'center'
  },
  drawerBtn: {
    height:height(2.5),
    width:width(15),
    resizeMode:'contain',
    alignSelf:'center'
  },
  headerTxtCon: {
    height:height(3.3),
    width:width(55),
    alignSelf:'center',
    justifyContent:'center',
  },
  headerTxt: {
    fontSize:totalSize(2),
    color:'#ffffff',
    alignSelf:'flex-start'
  },
  headerSearch: {
    height:height(3.2),
    width:width(15),
    resizeMode:'contain',
    alignSelf:'center'
  },
  cart: {
    height:height(3.2),
    width:width(15),
    resizeMode:'contain',
    alignSelf:'center'
  },

});

export default styles;