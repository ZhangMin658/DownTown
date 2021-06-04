import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_BACKGROUND,COLOR_SECONDARY,COLOR_TRANSPARENT_BLACK,COLOR_RED,COLOR_GRAY,COLOR_ORANGE,COLOR_BROWN,COLOR_YELLOW,COLOR_PINK,COLOR_LIGHT_BLUE } from '../common';
const headingText = 1.6;
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#f9f9f9'
  },
  blogCon:{
    elevation :10,
    shadowOpacity: 0.6,
    // height:height(50),
    width:width(80),
    alignItems:'center',
    marginVertical:10,shadowColor:'gray',alignSelf:'center',backgroundColor:COLOR_PRIMARY
  },
  ImgViewCon:{
    height:height(35),width:width(92),marginBottom:10
  },
  stripCon:{
    height:height(4),width:width(60),flexDirection:'row',alignItems:'center'
  },
  checkImg: {
    height:height(2),width:width(5),resizeMode:'contain'
  },
  text: {
    fontSize:totalSize(headingText),marginHorizontal: 10,color:COLOR_SECONDARY
  }
});

export default styles;
