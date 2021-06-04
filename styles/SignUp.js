import React, { Component } from 'react';
import { Platform,I18nManager,StyleSheet } from 'react-native';
import { COLOR_PRIMARY, socialBtnText,buttonText,SloganText,InputTextSize,SignInHeaderText, } from './common';
import { width, height, totalSize } from 'react-native-dimension';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red'
  },
  imgCon: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  appleBtn: { height: height(5.5), width: width(50) },
  bckImgCon: {
    flex: 0.5,
    justifyContent: 'flex-end'
  },
  backBtn: {
    height: height(2.5),
    width: width(3),
    marginLeft: 25,
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}],
  },
  headerTxt: {
    // fontFamily: FONT_NORMAL,
    fontWeight: 'bold',
    fontSize: SignInHeaderText,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    paddingEnd: 25,
  },
  logoView: {
    height: height(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    height: height(7.7),
    width: width(60),
    resizeMode: 'contain'
  },
  logoTxt: {
    height: height(8),
    width: width(65),
    textAlign: 'center',
    // fontFamily: FONT_NORMAL,
    marginTop: 7,
    fontSize: SloganText,
    color: 'white',
    marginTop: 30
  },
  buttonView: {
    height: Platform.OS==='ios'? height(47):height(50),
    alignItems: 'center',
  },
  userImg: {
    height: height(3.5),
    width: width(5.5),
    marginHorizontal: 15
  },
  mail: {
    height: height(5.5),
    width: width(5.5),
    marginHorizontal: 15
  },
  btn: {
    height: height(6),
    width: width(80),
    flexDirection: 'row',
    borderRadius: 3,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(172, 172, 172, 0.2)',
    borderColor: 'rgba(172, 172, 172, 0.5)',
    borderWidth: 1,
    marginTop: 5
  },
  inputTxt: {
    alignSelf: 'stretch',
    height: height(6),
    textAlignVertical: 'center',
    fontSize: InputTextSize,
    textAlign: 'left',
    color: COLOR_PRIMARY,
  },
  socialBtnText: {
    fontSize: socialBtnText, color: 'white' 
  },
  signUpBtn: {
    height: height(6),
    width: width(80),
    marginTop: 10,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc400'
  },
  buttonCon: {
    width: width(37.1), 
    height: height(5), 
    borderRadius: 3, 
    backgroundColor: '#134A7C', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  signTxt: {
    // fontFamily: FONT_NORMAL,
    fontSize: buttonText,
    color: 'white',
    fontWeight: 'bold'
  },
  signUpTxt: {
    // fontWeight: 'bold',
    fontSize: buttonText,
    color: COLOR_PRIMARY,
  },
  fgBtn: {
    height: height(5.5),
    width: width(80),
    flexDirection: 'row',
    marginTop: 20
  },
  other: {
    height: height(5.5),
    width: width(29.5),
    resizeMode: 'contain',
  },
  orTxt: {
    // height:height(5.5),
    marginTop: 10,
    width: width(6),
    textAlign: 'center',
    // fontFamily: FONT_NORMAL,
    fontSize: 10,
    color: '#ffffff',
  },
  expTxt: {
    // fontFamily: FONT_NORMAL,
    fontSize: 12,
    color: 'black'
  },
  signUpT: {
    height: height(3),
    // fontFamily: FONT_BOLD,
    fontWeight: 'bold',
    fontSize: 12,
    textDecorationLine: 'underline',
    color: 'black',
  },
  footer: {
    height: height(7),
    width: width(65),
    justifyContent: 'center',
    flexDirection: 'row'
  },
  terms_checkbox:{
    backgroundColor: "transparent", 
    borderWidth: 0 ,
    color: COLOR_PRIMARY,
    padding: 0,
    margin: 0
  },
  terms_checkbox_txt:{
    color: COLOR_PRIMARY,
    fontWeight: 'normal',
    marginRight: 0
  },
  terms_line : {
    flex : 1,
    justifyContent: 'flex-start',
    alignItems : 'flex-end',
    flexDirection: 'row',
    marginBottom : 10,
    width:width(80),
    paddingLeft: 0,
  },
  terms_txt : {
    color: COLOR_PRIMARY,
    fontWeight: 'normal',
    marginLeft: -5,
    height: 21
  }
});

export default styles;
