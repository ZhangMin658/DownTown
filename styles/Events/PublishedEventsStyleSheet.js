import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_NORMAL,FONT_BOLD,COLOR_PRIMARY,COLOR_ORANGE,COLOR_BACKGROUND } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const titleSize = totalSize(1.6);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    backgroundColor: '#f9f9f9'
  },
  featuredFLItem: {
    height:height(16),
    width:width(94),
    flexDirection: 'row',
    backgroundColor:'rgba(255,255,255,1)',
    marginVertical:8,
    borderWidth: 0.1,
    borderColor: 'gray',
    borderRadius:3,
    alignSelf:'center',
    elevation :3,
    // shadowColor:'gray',
  },
  featuredImg: {
    height:height(16),
    width:width(23),
    margin: 0,
    justifyContent:'center',
    alignItems:'flex-end'
  },
  closedBtn: {
    height:height(3),
    width:width(16),
    borderRadius:4,
    backgroundColor: COLOR_ORANGE,
    marginLeft:10,
    justifyContent:'center'
  },
  closedBtnTxt: {
    fontFamily: FONT_NORMAL,
    color:'black',
    fontSize:totalSize(1.1),
    alignSelf:'center'
  },
  txtViewCon: {
    height:height(16),
    width:width(73),
    justifyContent:'center'
  },
  txtViewHeading: {
    // fontFamily: FONT_BOLD,
    fontWeight:'bold',
    marginLeft:10,
    fontSize:totalSize(1.5),
    color:'black',
  },
  subHeadingTxt: {
    // fontFamily: FONT_NORMAL,
    marginTop:0,
    marginLeft:5,
    fontSize:totalSize(1.4),
    color:'black',
  },
  ratingCon: {
    height:height(8),
    width:width(55),
    flexDirection:'row',
  },
  ratingStyle: {
    height:height(3),
    width:width(18),
    alignItems:'center',
    flexDirection:'row',
    marginLeft:10,
    // marginHorizontal: 1,
    // paddingVertical:10,
    // paddingHorizontal:10
  },
  gradingCon: {
    height:height(3),
    width:width(22),
    justifyContent:'center',
  },
  ratingTxt: {
    marginTop:0,
    marginLeft:0,
    fontSize:totalSize(1.5),
    color: COLOR_ORANGE,
    fontFamily: FONT_BOLD
  },
  exploreBtn: {
    height:height(7),
    width:width(100),
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: COLOR_ORANGE
  },
  btnIcon: {
    height:height(2.5),
    width:width(8),
    resizeMode:'contain',
    alignSelf:'center'
  },
  explorebtnTxt: {
    fontFamily: FONT_NORMAL,
    fontSize:totalSize(1.5),
    color:'#ffffff'
  },
});

export default styles;
