import React, { Component } from 'react';
import { StyleSheet , Platform } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_SECONDARY,COLOR_RED,COLOR_BACKGROUND,COLOR_GRAY,COLOR_TRANSPARENT_BLACK,COLOR_ORANGE,COLOR_BROWN,COLOR_YELLOW,COLOR_PINK,COLOR_LIGHT_BLUE } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
const fieldCOLOR = 'rgba(211,211,211,0.3)';
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:COLOR_BACKGROUND
  },
  containerImg: {
    height:height(40),backgroundColor: COLOR_PRIMARY
  },
  cardContainer:{
    elevation: 10,height:height(60),width:width(93),borderRadius:3,alignSelf:'center',marginVertical:15,backgroundColor: COLOR_PRIMARY
  },
  priceCon:{
    height:height(4),justifyContent:'flex-start',alignItems:'flex-end',flexDirection:'row'
  },
  blackText:{
    fontSize:totalSize(titles),fontWeight:'bold',color: COLOR_SECONDARY
  },
  goldenText: {
    fontSize:totalSize(titles),fontWeight:'bold',color: COLOR_ORANGE,textDecorationLine:'line-through',marginHorizontal:10
  },
  ratingCon:{
    height:height(3),alignItems:'center',flexDirection:'row',justifyContent:'flex-start'
  },
  ratingText: {
    fontSize:totalSize(paragraphTxt),color: COLOR_SECONDARY,marginHorizontal:10
  },
  title: {
    fontSize:totalSize(titles),color: COLOR_SECONDARY
  },
  listCon: {
    flex:1,marginHorizontal:12,marginVertical:5,marginBottom:5
  },
  listItem:{
    fontSize:totalSize(subHeadingTxt),marginVertical:3,color: COLOR_SECONDARY
  },
  paraTitle:{
    fontSize:totalSize(titles),
    // fontFamily:FONT_BOLD,
    fontWeight:'bold',
    color: COLOR_SECONDARY
  },
  paragraph: {
    fontSize:totalSize(paragraphTxt),
    // fontFamily:FONT_NORMAL,
    color: COLOR_SECONDARY
  },
  pickerTitle:{
    fontSize:totalSize(headingTxt),
    // fontFamily:FONT_NORMAL,
    color: COLOR_SECONDARY,textAlign:'center'
  },
  AccordionTitle:{
    width:width(80),fontSize:totalSize(headingTxt),marginLeft:15,color:COLOR_SECONDARY,
    // fontFamily:FONT_NORMAL
  },
  AccordionParagraph: {
    alignSelf:'center',margin:10,
    // fontFamily: FONT_NORMAL,
    fontSize:totalSize(paragraphTxt)
  },

});

export default styles;
