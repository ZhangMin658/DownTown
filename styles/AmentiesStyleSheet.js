import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_SECONDARY,COLOR_RED,COLOR_GRAY,COLOR_ORANGE,COLOR_BROWN,COLOR_YELLOW,COLOR_PINK,COLOR_LIGHT_BLUE } from './common';
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
  listCon: {
    flex:1,
    flexDirection: 'row',
    flexWrap:'wrap',
    marginHorizontal:25,
    marginVertical:15,
    // alignSelf:'center'
  },
  listChild:{
    height:height(5),
    width:width(42),
    flexDirection: 'row',
    justifyContent:'center',
  },
  childIcon: {
    height:height(2.5),
    width:width(4),
    resizeMode:'contain',
    marginHorizontal:10,
    alignSelf:'center',
  },
  childTxtCon: {
    height:height(5),
    width:width(36),
    alignSelf:'center',
    justifyContent:'center',
    marginTop: 10,
    alignItems:'flex-start'
  },
  childTxt: {
    fontSize:totalSize(headingTxt),
    fontFamily: FONT_NORMAL,
    color:COLOR_SECONDARY,
  },
  largeTxt: {
    flex:1,
    marginHorizontal:25,
    marginVertical: 10,
    fontSize:totalSize(paragraphTxt),
    color: COLOR_GRAY,
    textAlignVertical: 'center'
  },
});

export default styles;
