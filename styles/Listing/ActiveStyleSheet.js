import React, { Component } from 'react';
import { StyleSheet,Platform } from 'react-native';
import { COLOR_PRIMARY,COLOR_ORANGE,COLOR_BACKGROUND,COLOR_SECONDARY } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const buttonTxt = 1.8;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const subHeadingText = 1.5;
const smallButtons = 1.2;
const titles = 1.8;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems:'center',
    backgroundColor: '#f9f9f9',
    flexDirection: 'column'
  },
  featuredFLItem: {
    ...Platform.select({
      ios: { shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: 2 },
      android: { elevation: 2, }
    }),
    height:height(15),
    width:width(94),
    flexDirection: 'row',
    backgroundColor:'rgba(255,255,255,1)',
    marginVertical: 5,
    marginHorizontal: 5,
    alignSelf:'center',
    borderWidth: 0.1,
    borderColor: 'gray',
    borderRadius:5,
  },
  featuredImg: {
    height:height(15),
    width:width(32),
    alignSelf: 'stretch',
    margin: 0,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5
  },
  closedBtn: {
    borderRadius:4,
    backgroundColor: COLOR_ORANGE,
    marginLeft:10,
    justifyContent:'center'
  },
  closedBtnTxt: {
    color: COLOR_PRIMARY,
    fontSize:totalSize(smallButtons),
    alignSelf:'center',
    marginHorizontal: 5 ,
    marginVertical: 3
  },
  txtViewCon: {
    height:height(15),
    width:width(60),
    alignItems:'center',
    flexDirection:'row'
  },
  txtViewHeading: {
    marginLeft:10,
    fontSize: 11,
  },
  subHeadingTxt: {
    fontSize: 11,
  },
  viewDetail: {
    fontWeight: 'bold',
    marginVertical: 5,
    marginLeft: 10,
    fontSize: 13, //totalSize(S16)
    color: 'black',
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
    color: '#a3a3a3',
    // fontFamily: FONT_BOLD
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
    // fontFamily: FONT_NORMAL,
    fontSize:totalSize(1.5),
    color:'#ffffff'
  },
});

export default styles;
