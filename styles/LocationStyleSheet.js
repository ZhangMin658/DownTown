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
  mapCon: {
    height:height(50),
    width:width(90),
    marginHorizontal: 5,
    marginVertical: 15,
    alignSelf:'center',
    alignItems:'center'
  },
  map: {
    height:height(45),
    width:width(90),
    zIndex : -10,
    position: 'absolute',
  },
  
});

export default styles;
