import React, { Component } from 'react';
import { StyleSheet,Platform } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_SECONDARY,COLOR_BACKGROUND,COLOR_LIME_GREEN,COLOR_LIGHT_PINK,COLOR_RED,COLOR_GRAY,COLOR_ORANGE,COLOR_BROWN,COLOR_YELLOW,COLOR_PINK,COLOR_LIGHT_BLUE,COLOR_DARK_GRAY } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
const styles = StyleSheet.create({
  container: {
    flex:1,
    alignItems: 'center',
    backgroundColor: COLOR_BACKGROUND
  },
  titleCon:{
    height:height(6),
    width:width(50),
    marginHorizontal:15,
    marginBottom:20,
    alignItems:'flex-end',
    flexDirection:'row'
  },
  titleTxt: {
    width:width(61),
    fontSize:totalSize(1.8),
    color: COLOR_SECONDARY,
    fontWeight: 'bold'
  },
  cameraCon: {
    height:height(15),
    width:width(75),
    marginHorizontal: 0,
    marginVertical:5,
    flexDirection:'row',
    alignSelf:'center',
    justifyContent:'center',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLOR_GRAY
  },
  cameraSubCon: {
    height:height(15),
    width:width(50),
    justifyContent:'center',
    borderRightWidth: 0.5,
    borderColor: COLOR_GRAY
  },
  cameraIcon: {
    height:height(4),
    width:width(15),
    resizeMode:'contain',
    alignSelf:'center'
  },
  cameraBtnTxt: {
    height:height(6),
    width:width(55),
    textAlign:'center',
    textAlignVertical:'center',
    color: COLOR_SECONDARY,
    // fontFamily: FONT_NORMAL ,
    fontSize: totalSize(subHeadingTxt)
  },
  tickBtnCon: {
    height:height(15),
    width:width(25),
    justifyContent:'center',
    alignItems:'center',
  },

});

export default styles;
