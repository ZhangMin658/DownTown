import React, { Component } from 'react';
import { StyleSheet , Platform } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_SECONDARY,COLOR_RED,COLOR_GRAY,COLOR_ORANGE,COLOR_BROWN,COLOR_YELLOW,COLOR_PINK,COLOR_LIGHT_BLUE } from '../common';
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
    backgroundColor:'#ffffff'
  },
  bgImg: {
    height:height(45),
    width:width(100),
    justifyContent:'flex-end'
  },
  imgConView: {
    height:height(45),
    width:width(100),
    backgroundColor:'rgba(0,0,0,0.8)',
    alignItems:'center',
    justifyContent:'flex-end'
  },
  subCon: {
    ...Platform.select({
      ios: {height:height(30),},
      android: {height:height(30)}
    }),
    alignSelf:'flex-end',
    width:width(100),
    alignItems:'center',
  },
  nameTxt: {
    // fontFamily: FONT_BOLD,
    color: COLOR_ORANGE,
    fontSize: totalSize(headingTxt),
    marginVertical: 5
  },
  addressTxt: {
    // fontFamily: FONT_BOLD,
    color: COLOR_PRIMARY,
    fontSize: totalSize(headingTxt),
    marginBottom: 5
  },
  listCon: {
    height:height(9),
    width:width(100),
    marginTop: 5,
    justifyContent:'center',
    alignItems:'flex-start',
    flexDirection:'row'
  },
  listTab: {
    height:height(6),
    borderRightWidth:0.5,
    justifyContent:'center',
    alignItems:'center',
    borderColor:'white'
  },
  number: {
    // fontFamily: FONT_BOLD,
    fontWeight:'bold',
    color: COLOR_PRIMARY,
    fontSize: totalSize(headingTxt)
  },
  listLabel: {
    // fontFamily: FONT_NORMAL,
    color: COLOR_PRIMARY,
    fontSize: totalSize(headingTxt),
    marginHorizontal:15
  },

});

export default styles;
