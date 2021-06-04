import React, { Component } from 'react';
import { StyleSheet,I18nManager } from 'react-native';
import { FONT_NORMAL,COLOR_PRIMARY,COLOR_TRANSPARENT_BLACK,COLOR_ORANGE,S25,S2,S18,S17,S16,S15,S14,S13,S12,S11 } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const size = totalSize(S18);
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: COLOR_TRANSPARENT_BLACK,
  },
  headerCon: {
    height:height(25),
  },
  profileImgCon: {
    // height:height(15),
    flex:5,
    justifyContent:'center',
    alignSelf:'center'
  },
  userName: {
    flex:1,
    marginTop:5,
    textAlign:'center',
    color: COLOR_ORANGE,
    fontSize:totalSize(S17),
    fontFamily:FONT_NORMAL
  },
  userEmail: {
    flex:3,
    textAlign:'center',
    color: COLOR_PRIMARY,
    fontSize:totalSize(S17),
    fontFamily:FONT_NORMAL
  },
  drawerItem: {
    // height:height(7),
    flex:2,
    flexDirection:'row',
    // backgroundColor:'red',
    // marginVertical:1
  },
  itemIconCon: {
    height:height(7),
    width:width(15),
    justifyContent:'center',
    alignItems:'center'
    // backgroundColor:'orange'
  },
  itemIcon: {
    height:height(2.5),
    width:width(6),
    alignSelf:'center',
    resizeMode:'contain',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
    // backgroundColor:'green'
  },
  itemTxtCon: {
    flex:4.5,
    // height:height(7),
    // width:width(50),
    alignItems:'flex-start',
    justifyContent:'center',
    // backgroundColor:'orange'
  },
  itemTxt: {
    fontSize: size,
    // fontFamily: FONT_NORMAL,
    color:COLOR_PRIMARY
  },

});

export default styles;
