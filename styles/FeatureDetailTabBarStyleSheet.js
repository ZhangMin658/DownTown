import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY } from './common';
import { width, height, totalSize } from 'react-native-dimension';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  overlyHeader: {
    height:height(8),
    width:width(100),
    zIndex:1000,
    position:'absolute',
    flexDirection:'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  backImgCon: {
    height:height(2.5),
    width:width(15),
    justifyContent:'center',
    alignSelf:'center'
  },
  backBtn: {
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
    fontFamily: FONT_BOLD,
    fontSize:totalSize(2.1),
    color:'#ffffff',
  },
});

export default styles;
