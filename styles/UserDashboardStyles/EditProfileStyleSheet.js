import React, { Component } from 'react';
import { StyleSheet,Platform } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_SECONDARY,COLOR_BACKGROUND,COLOR_LIME_GREEN,COLOR_LIGHT_PINK,COLOR_RED,COLOR_GRAY,COLOR_ORANGE,COLOR_BROWN,COLOR_YELLOW,COLOR_PINK,COLOR_LIGHT_BLUE,COLOR_DARK_GRAY } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const buttonTxt = 1.8;
const paragraphTxt = 1.5;
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
    height:height(5),
    marginHorizontal:15,
    marginBottom:0,
    alignItems:'flex-end',
    flexDirection:'row',
  },
  titleTxt: {
    // width:width(61),
    fontSize:totalSize(titles),
    color: COLOR_SECONDARY,
    fontWeight:'bold',
    textAlign: 'left'
  },
  changeBtnCon: {
    borderRadius:4,
    alignItems:'center',
    backgroundColor: COLOR_LIME_GREEN,
    justifyContent:'center'
  },
  closeBtnTxt: {
    fontSize:totalSize(smallButtons),
    color: COLOR_PRIMARY,
    marginHorizontal: 10,
    marginVertical: 7
  },
  textInputCon: {
    height:height(10),
    marginHorizontal:15,
    marginVertical:5,
    width: width(90),
    alignItems:'flex-start'
  },
  textInputLabel: {
    fontSize:totalSize(headingTxt),
    marginVertical:7,
    color: COLOR_DARK_GRAY,
    textAlign: 'left'
  },
  subCon: {
    height:height(6),
    flexDirection:'row',
    borderRadius:5,
    borderWidth: 0.8,
    borderColor:COLOR_GRAY,
  },
  iconCon: {
    width:width(8),
    justifyContent:'center',
    alignItems:'center'
  },
  icon: {
    height:height(3),
    width:width(3),
    resizeMode: 'contain'
  },
  textInput: {
    height:height(6),
    borderRadius:5,
    borderWidth: 0.8,
    paddingHorizontal:10,
    width: width(90),
    fontSize:totalSize(paragraphTxt),
    // fontFamily:FONT_NORMAL,
    color: COLOR_DARK_GRAY,
    borderColor:COLOR_GRAY
  },
  socialInput: {
    // height:height(6),
    borderRadius:5,
    paddingHorizontal:10,
    fontSize:totalSize(paragraphTxt),
    // fontFamily:FONT_NORMAL,
    color: COLOR_DARK_GRAY,
  },
  aboutInputCon: {
    height:height(23),
    marginHorizontal:15,
    marginVertical:5,
    alignItems:'flex-start'
  },
  aboutInputText: {
    height:height(20),
    width: width(90),
    borderRadius:5,
    borderWidth: 0.8,
    paddingHorizontal:10,
    fontSize:totalSize(paragraphTxt),
    color: COLOR_DARK_GRAY,
    borderColor:COLOR_GRAY,
    ...Platform.select({
      ios: {  },
      android: { textAlignVertical: 'top', }
    }),
  },
  labelTxt: {
    fontSize:totalSize(headingTxt),
    color: COLOR_SECONDARY,
    marginHorizontal:15,
    marginVertical: 15,
    fontWeight:'bold',
    marginBottom:10,
    // fontFamily: FONT_BOLD
  },
  txtInput: {
    height:height(6),
    width:width(80),
    fontSize:totalSize(paragraphTxt),
    // fontFamily:FONT_NORMAL,
    color: 'gray',
    alignSelf:'center'
  },
  profielBtn: {
    height:height(6),
    width:width(93),
    marginVertical:15,
    borderRadius:5,
    backgroundColor: COLOR_ORANGE,
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center'
  },
  profielBtnTxt: {
    fontSize:totalSize(buttonTxt),
    color: COLOR_PRIMARY,
    // fontFamily: FONT_BOLD
  },

});

export default styles;
