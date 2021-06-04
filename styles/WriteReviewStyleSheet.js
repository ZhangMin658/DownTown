import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { COLOR_PRIMARY, COLOR_SECONDARY, COLOR_GRAY, COLOR_ORANGE } from './common';
import { width, height, totalSize } from 'react-native-dimension';
const buttonTxt = 1.8;
const paragraphTxt = 1.5;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  ratingCon: {
    height: height(5),
    width: width(85),
    marginHorizontal: 25,
    marginTop: 10,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  ratingStyle: {
    height: height(3),
    width: width(22),
    paddingVertical: 10,

    // paddingHorizontal:10
  },
  titleCon: {
    height: height(8),
    width: width(85),
    marginHorizontal: 25,
    alignSelf: 'center',
    justifyContent: 'center'
  },
  inputTxt: {
    alignSelf: 'stretch',
    height: height(6),
    width: width(85),
    textAlignVertical: 'center',
    paddingHorizontal: 15,
    fontSize: totalSize(paragraphTxt),
    color: COLOR_SECONDARY,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLOR_GRAY,
    // fontFamily: FONT_NORMAL
  },
  cameraCon: {
    // height: height(15),
    width: width(85),
    marginHorizontal: 25,
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems:'center',
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLOR_GRAY
  },
  cameraSubCon: {
    height: height(15),
    width: width(55),
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderColor: COLOR_GRAY
  },
  cameraIcon: {
    height: height(5),
    width: width(55),
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  cameraBtnTxt: {
    height: height(6),
    width: width(55),
    textAlign: 'center',
    textAlignVertical: 'center',
    color: COLOR_SECONDARY,
    // fontFamily: FONT_NORMAL ,
    fontSize: totalSize(headingTxt)
  },
  tickBtnCon: {
    height: height(15),
    width: width(30),
    justifyContent: 'center',
    alignItems: 'center'
  },
  reviewCon: {
    height: height(26),
    width: width(85),
    marginHorizontal: 25,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  inputTxtReview: {
    height: height(22),
    width: width(85),
    ...Platform.select({
      ios: { alignSelf: 'flex-start' },
      android: { textAlignVertical: 'top', }
    }),
    paddingHorizontal: 15,
    fontSize: totalSize(paragraphTxt),
    color: COLOR_SECONDARY,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: COLOR_GRAY,
    // fontFamily: FONT_NORMAL
  },
  reviewBtn: {
    width: width(85),
    marginHorizontal: 25,
    marginVertical: 5,
    alignSelf: 'center',
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: COLOR_ORANGE,
    textAlign: 'center',
    justifyContent: 'center',
  },
  reviewBtnTxt: {
    marginVertical: 10,
    color: COLOR_PRIMARY,
    fontSize: totalSize(buttonTxt),
    // fontWeight:'bold',
    alignSelf: 'center',
    textAlign: 'center'
  },
});

export default styles;
