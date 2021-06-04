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
    height:height(6),
    marginHorizontal:15,
    marginBottom:20,
    alignItems:'flex-end',
    flexDirection:'row'
  },
  titleTxt: {
    fontSize:totalSize(titles),
    color: COLOR_SECONDARY,
    fontWeight:'bold',
    // fontFamily: FONT_BOLD
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
    fontSize:totalSize(smallButtons),
    color: COLOR_PRIMARY,
    // fontFamily: FONT_BOLD
  },
  subTitleCon: {
    height:height(12),
    justifyContent:'center',
    backgroundColor: COLOR_LIGHT_PINK
  },
  subTitleTxt: {
    fontSize:totalSize(headingTxt),
    color: COLOR_DARK_GRAY,
    marginHorizontal:15,
    // fontFamily: FONT_BOLD
  },
  time: {
    fontSize:totalSize(smallButtons),
    marginTop:2,
    color: '#a3a3a3'
  },
  label1: {
    fontSize:totalSize(paragraphTxt),
    color: '#a3a3a3',
    marginRight: 5
  },
  label2: {
    fontSize:totalSize(headingTxt),
    fontWeight:'bold',
    marginHorizontal:0,
    color: COLOR_SECONDARY,
    marginBottom: 5,
    textAlign:'left'
  },
  bellText: {
    fontSize:totalSize(headingTxt),
    fontWeight:'bold',
    marginTop:2,
    color:COLOR_SECONDARY
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
    fontSize:totalSize(titles),
    color: COLOR_SECONDARY,
    fontWeight:'bold',
    marginHorizontal:15,
    // fontFamily: FONT_BOLD
  },
  boxMessage: {
    fontSize:totalSize(paragraphTxt),
    color: COLOR_GRAY,
    marginHorizontal:15,
    // fontFamily: FONT_NORMAL
  },
  viewBtn: {
    borderRadius:5,
    justifyContent:'center',
    alignItems:'center',
    marginHorizontal:15,
    backgroundColor: COLOR_ORANGE
  },
  btnTxt: {
      fontSize:totalSize(headingTxt),
      color: COLOR_PRIMARY,
      marginVertical: 5,
      marginHorizontal: 5
  },

});

export default styles;
