import React, { Component } from 'react';
import { StyleSheet,Platform } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_SECONDARY,COLOR_BACKGROUND,COLOR_LIGHT_PINK,COLOR_RED,COLOR_LIME_GREEN,COLOR_GRAY,COLOR_ORANGE,COLOR_BROWN,COLOR_YELLOW,COLOR_PINK,COLOR_LIGHT_BLUE,COLOR_DARK_GRAY } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const buttonTxt = 1.8;
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
    marginHorizontal:15,
    marginBottom:20,
    alignItems:'flex-end',
    flexDirection:'row'
  },
  titleTxt: {
    width:width(61),
    fontSize:totalSize(titles),
    color: COLOR_SECONDARY,
    fontWeight:'bold'
    // fontFamily: FONT_BOLD
  },
  changeBtnCon: {
    height:height(3.8),
    width:width(30),
    borderRadius:4,
    alignItems:'center',
    backgroundColor: COLOR_LIME_GREEN,
    justifyContent:'center'
  },
  closeBtnTxt: {
    fontSize:totalSize(1.2),
    color: COLOR_PRIMARY,
    fontFamily: FONT_NORMAL
  },
  userInfoCon: {
    height:height(6),
    width:width(92),
    alignSelf:'center',
    alignItems:'center',
    flexDirection:'row',
    borderBottomWidth:0.3,
    borderColor: COLOR_GRAY,
    justifyContent:'center'
  },
  label: {
    fontSize:totalSize(headingTxt),
    color: COLOR_SECONDARY,
    textAlign:'left'
    // fontFamily: FONT_BOLD
  },
  txt: {
    fontSize:totalSize(paragraphTxt),
    color: COLOR_SECONDARY,
    textAlign:'left'
    // fontFamily: FONT_NORMAL
  },
  labelMedia: {
    textAlign:'left',
    fontWeight:'bold',
    fontSize:totalSize(titles),
    color: COLOR_SECONDARY,
    marginVertical:10,
    marginHorizontal:15,
  },
  labelTxt: {
    fontSize:totalSize(paragraphTxt),
    color: COLOR_DARK_GRAY,
    marginHorizontal:15,
    marginVertical: 5,
    textAlign:'left'
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
    justifyContent:'center',
    alignItems:'flex-start'
  },
  boxTitleTxt: {
    fontSize:totalSize(titles),
    fontWeight:'bold',
    color: COLOR_SECONDARY,
    marginHorizontal:15,
    // fontFamily: FONT_BOLD
  },
  boxMessage: {
    fontSize:totalSize(paragraphTxt),
    color: COLOR_GRAY,
    marginHorizontal:15,
    // fontFamily: FONT_NORMAL
  },
  longTxt: {
    width:width(88),
    marginHorizontal:15,
    marginVertical: 0,
    fontSize:totalSize(paragraphTxt),
    color: COLOR_GRAY,
    textAlignVertical: 'center',
    alignSelf:'center'
  }, 
  viewBtn: {
    height:height(5),
    width:width(30),
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:15,
    backgroundColor: COLOR_ORANGE
  },
  btnTxt: {
      fontSize:totalSize(headingTxt),
      color: COLOR_PRIMARY,
      // fontFamily: FONT_NORMAL
  },

});

export default styles;
