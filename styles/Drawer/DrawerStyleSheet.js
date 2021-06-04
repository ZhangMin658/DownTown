import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_GRAY,COLOR_SECONDARY } from '../common';
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
    // zIndex:1000,
    // position:'absolute',
    flexDirection:'row',
    backgroundColor: 'rgba(0,0,0,1)',
    justifyContent:'center'
  },
  drawerBtnCon: {
    // height:height(4),
    // width:width(15),
    flex:1,
    justifyContent:'center',
    alignSelf:'center'
  },
  drawerBtn: {
    height:height(2.6),
    width:width(15),
    resizeMode:'contain',
    alignSelf:'center'
  },
  headerTxtCon: {
    // height:height(3.3),
    // width:width(55),
    flex:4,
    alignSelf:'center',
    justifyContent:'center',
  },
  headerTxt: {
    // fontFamily: FONT_BOLD,
    fontWeight: 'bold',
    fontSize:totalSize(2),
    color:'#ffffff',
  },
  headerSearch: {
    height:height(3.2),
    width:width(15),
    flex:1,
    resizeMode:'contain',
    alignSelf:'center'
  },
  cart: {
    height:height(3.2),
    width:width(15),
    flex:1,
    resizeMode:'contain',
    alignSelf:'center'
  },
  headerCon: {
    height:height(25),
  },
  profileImgCon: {
    // height:height(15),
    flex:5,
    justifyContent:'flex-end',
    alignSelf:'center'
  },
  userName: {
    flex:1,
    marginTop:5,
    textAlign:'center',
    color: COLOR_ORANGE,
    fontSize:totalSize(1.7),
    fontFamily:FONT_NORMAL
  },
  userEmail: {
    flex:3,
    textAlign:'center',
    color: COLOR_PRIMARY,
    fontSize:totalSize(1.7),
    fontFamily:FONT_NORMAL
  },
});

export default styles;
