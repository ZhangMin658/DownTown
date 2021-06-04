import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,FONT_NORMAL_IOS } from './common';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgCon: {
    flex:1,
    alignSelf:'stretch',
    alignItems:'center'
  },
  logoView: {
    height:height(50),
    alignItems:'center',
    justifyContent:'center'
  },
  logoImg: {
    height:height(7),
    width:width(51.5),
    resizeMode:'contain'
  },
  logoTxt: {
    height:height(12),
    width:width(65),
    textAlign:'center',
    fontFamily: FONT_NORMAL,
    marginTop:7,
    fontSize:totalSize(2.2),
    color:'white'
  },
  buttonView: {
    height:height(40),
    alignItems:'center',
  },
  signInBtn: {
    height:height(6),
    width:width(65),
    borderRadius:3,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(172, 172, 172, 0.2)',
    borderColor:'rgba(172, 172, 172, 0.5)',
    borderWidth:1
  },
  signUpBtn: {
    height:height(6),
    width:width(65),
    marginTop:10,
    borderRadius:3,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#ffc400'
  },
  signTxt: {
    fontFamily: FONT_BOLD,
    fontSize:totalSize(1.5),
    color: COLOR_PRIMARY,
  },
  signUpTxt: {
    fontFamily: FONT_BOLD,
    fontSize:totalSize(1.5),
    color: COLOR_PRIMARY,
  },
  expTxt: {
    height:height(10),
    width:width(65),
    textAlign:'center',
    fontFamily: FONT_NORMAL,
    marginTop:7,
    fontWeight: 'bold',
    fontSize:totalSize(1.4),
    color:'black'
  }
});

export default styles;
