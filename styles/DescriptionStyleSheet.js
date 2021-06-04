import React, { Component } from 'react';
import { StyleSheet , Platform,I18nManager } from 'react-native';
import { COLOR_PRIMARY,COLOR_SECONDARY,COLOR_RED,COLOR_GRAY,COLOR_ORANGE,COLOR_BROWN,COLOR_YELLOW,COLOR_PINK,COLOR_LIGHT_BLUE,S18,S14 } from './common';
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
    // justifyContent:'center',
    backgroundColor:'#ffffff'
  },
  listCon: {
    flex:1,
    width:width(88),
    marginHorizontal:15,
    marginVertical:5,
    alignItems:'flex-start',
    flexDirection:'row',
    alignSelf:'center',
    flexWrap:'wrap',
  },
  flatlistChild: {
    height:height(11),
    width:width(26.5),
    margin:3,
    alignSelf:'center',
    justifyContent:'center',
    alignItems:'center'
  },
  childImg: {
    height:height(10),
    width:width(26.5),
    alignSelf:'center',
  },
  labelCon: {
    height:height(7),
    width:width(88),
    // marginHorizontal:15,
    marginBottom:0.5,
    flexDirection:'row',
    borderColor: COLOR_GRAY,
    borderBottomWidth:0.4,
    justifyContent:'center',
    alignSelf:'center'
  },
  labelIcon: {
    height:height(7),
    width:width(8),
    marginHorizontal:5,
    resizeMode:'contain'
  },
  labeTxtCon: {
    flex:1,
    alignItems:'center',
    alignSelf:'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  labelTxt: {
    fontSize:totalSize(headingTxt),
    color: COLOR_SECONDARY,
    alignSelf:'center',
    marginVertical:4,
  },
  renderCon: {
    flex:1,
    width:width(88),
    marginVertical: 0,
    alignItems:'center',
    marginHorizontal:15,
    backgroundColor: COLOR_PRIMARY,
    borderWidth:0.3,
    borderColor: COLOR_GRAY,
    alignSelf:'center'
  },
  renderStrip: {
    height:height(6),
    width:width(85),
    borderBottomWidth:0.3,
    flexDirection:'row',
    borderColor: COLOR_GRAY,
  },
  stripDay: {
    height:height(6),
    width:width(42),
    justifyContent:'center'
  },
  stripTime: {
    height:height(6),
    width:width(42),
    justifyContent:'center',
    alignItems:'flex-end'
  },
  renderDayTxt: {
    fontSize:totalSize(paragraphTxt),
    color: COLOR_SECONDARY,
    marginHorizontal: 10
  },
  renderTimeTxt: {
    fontSize:totalSize(paragraphTxt),
    color: COLOR_SECONDARY,
    marginHorizontal: 10
  },
  priceTxt: {
    fontSize:totalSize(headingTxt),
    color: COLOR_SECONDARY,
  },
  dollarTxt: {
    fontSize:totalSize(headingTxt),
    color: COLOR_SECONDARY,
  },
  timeTxt: {
    fontSize:totalSize(headingTxt),
    color: COLOR_SECONDARY,
  },
  dropDownIcon: {
    height:height(2.5),
    width:width(8),
    marginHorizontal:0,
    resizeMode:'contain',
    alignSelf:'center',
    marginLeft:5,
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  },
  dealBox: {
    height:height(30),
    width:width(88),
    marginHorizontal:15,
    marginVertical: 10,
    backgroundColor: COLOR_PRIMARY,
    borderColor: COLOR_GRAY,
    borderWidth:0.3,
    justifyContent:'center',
    alignSelf:'center'
  },
  cuponBtnCon: {
    height:height(12),
    justifyContent:'center',
    alignItems:'center',
    borderBottomWidth: 0.4,
    borderColor: COLOR_GRAY,
    marginBottom: 0.2
  },
  cuponBtn: {
    height:height(6),
    width:width(80),
    backgroundColor: COLOR_ORANGE,
    borderRadius: 5,
    justifyContent:'center'
  },
  cuponBtnTxt: {
    fontSize:totalSize(buttonTxt),
    // fontFamily: FONT_NORMAL,
    color: COLOR_PRIMARY,
    textAlign:'center',
  },
  expCon: {
    height:height(18),
    width:width(88),
    justifyContent:'center',
    alignItems:'center'
  },
  expTxt: {
    // height:height(6),
    width:width(80),
    fontSize:totalSize(titles),
    // fontFamily: FONT_NORMAL,
    color: COLOR_SECONDARY,
    textAlign:'center',
    marginVertical: 15
  },
  expTimeCon: {
    height:height(12),
    width:width(88),
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center'
  },
  timeSubCon: {
    height:height(8),
    width:width(18),
    alignItems:'center',
    justifyContent:'center'
  },
  timeSubConWide: {
    height:height(8),
    width:width(22),
    alignItems:'center',
    justifyContent:'center'
  },
  dayTxt: {
    height:height(3),
    width:width(18),
    fontSize:totalSize(titles),
    fontWeight:'bold',
    // fontFamily: FONT_BOLD,
    color: COLOR_BROWN,
    textAlign:'center',
    textAlignVertical:'center'
  },
  hourTxt: {
    height:height(3),
    width:width(18),
    fontSize:totalSize(titles),
    fontWeight:'bold',
    color: COLOR_YELLOW,
    textAlign:'center',
    textAlignVertical:'center'
  },
  minuteTxt: {
    height:height(3),
    width:width(22),
    fontSize:totalSize(titles),
    fontWeight:'bold',
    color: COLOR_PINK,
    textAlign:'center',
    textAlignVertical:'center'
  },
  secondTxt: {
    height:height(3),
    width:width(22),
    fontSize:totalSize(titles),
    fontWeight:'bold',
    color: COLOR_LIGHT_BLUE,
    textAlign:'center',
    textAlignVertical:'center'
  },
  profileCon: {
    height: height(10),
    width:width(89),
    backgroundColor: 'rgba(211,211,211,0.4)',
    flexDirection: 'row',
    marginVertical: 10,
    alignSelf:'center'
  },
  imgCon: {
    marginHorizontal: 10,
    alignItems: 'flex-end',
    justifyContent: 'center'
  },
  autherText: {
    fontSize: totalSize(S18),
    color: COLOR_SECONDARY,
    marginVertical: 2,
    marginHorizontal: 10,
    textAlign: 'left'
  },
  viewBtn: {
    // width: width(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewBtnCon: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    marginHorizontal: 3
  },
  viewBtnText: {
    fontSize: totalSize(S14),
    color: COLOR_PRIMARY,
    fontWeight: 'bold',
    marginHorizontal: 10,
    marginVertical: 5
  },
  titleTxt: {
    height:height(5),
    width:width(80),
    marginHorizontal:25,
    marginVertical:5,
    fontSize:totalSize(titles),
    fontWeight:'bold',
    textAlign:'left',
    color: COLOR_SECONDARY,
    textAlignVertical: 'center'
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
});

export default styles;
