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
    alignItems:'flex-start',
    flexDirection:'row'
  },
  titleTxt: {
    fontSize:totalSize(titles),
    color: COLOR_SECONDARY,
    // fontFamily: FONT_BOLD,
    fontWeight:'bold'
  },
  changeBtnCon: {
    height:height(4),
    width:width(30),
    borderRadius:4,
    alignItems:'center',
    backgroundColor: COLOR_ORANGE,
    justifyContent:'center',
  },
  closeBtnTxt: {
    fontSize:totalSize(1.1),
    color: COLOR_PRIMARY,
    fontFamily: FONT_BOLD
  },
  subTitleCon: {
    height:height(12),
    justifyContent:'center',
    backgroundColor: COLOR_LIGHT_PINK
  },
  subTitleTxt: {
    fontSize:totalSize(1.3),
    color: COLOR_DARK_GRAY,
    marginHorizontal:15,
    fontFamily: FONT_BOLD
  },
  planBox: {
    height:height(23),
    width:width(90),
    marginVertical: 15,
    backgroundColor: 'rgba(169, 169, 169 , 0.1)',
    alignSelf:'center'
  },
  boxTitleCon: {
    height:height(5),
    justifyContent:'center'
  },
  boxTitleTxt: {
    fontSize:totalSize(1.4),
    color: COLOR_SECONDARY,
    marginHorizontal:15,
    fontFamily: FONT_BOLD
  },
  boxMessage: {
    fontSize:totalSize(1.3),
    color: COLOR_GRAY,
    marginHorizontal:15,
    fontFamily: FONT_NORMAL
  },
  viewBtn: {
    height:height(6),
    width:width(30),
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:15,
    backgroundColor: COLOR_ORANGE
  },
  btnTxt: {
      fontSize:totalSize(1.3),
      color: COLOR_PRIMARY,
      fontFamily: FONT_NORMAL
  },

});

export default styles;
