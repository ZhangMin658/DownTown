import React, { Component } from 'react';
import { Platform,StyleSheet, I18nManager } from 'react-native';
import { FONT_NORMAL, FONT_BOLD, COLOR_PRIMARY, S18, S17, S15, S12, socialBtnText,buttonText,SloganText,InputTextSize,SignInHeaderText, } from './common';
import { width, height, totalSize } from 'react-native-dimension';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imgCon: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center'
  },
  bckImgCon: {
    flex: 0.5,
    justifyContent: 'flex-end'
  },
  backBtn: {
    height: height(2.5),
    width: width(3),
    marginLeft: 25,
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }],
  },
  headerTxt: {
    fontWeight: 'bold',
    fontSize: SignInHeaderText,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    paddingEnd: 25,
  },
  logoView: {
    height: height(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    height: height(7.7),
    width: width(55),
    resizeMode: 'contain'
  },
  logoTxt: {
    height: height(12),
    width: width(65),
    textAlign: 'center',
    marginTop: 25,
    fontSize: SloganText,
    color: 'white'
  },
  buttonView: {
    height: Platform.OS==='ios'?height(45):height(50),
    alignItems: 'center',
  },
  userImg: {
    height: height(3.7),
    width: width(5),
    marginHorizontal: 15
  },
  mail: {
    height: height(5.6),
    width: width(5.6),
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
    borderColor: 'rgba(172, 172, 172, 0.8)',
    borderWidth: 1
  },
  inputTxt: {
    alignSelf: 'stretch',
    textAlign: 'left',
    height: height(6),
    justifyContent: 'center',
    fontSize: InputTextSize,
    color: COLOR_PRIMARY
  },
  signUpBtn: {
    height: height(6),
    width: width(80),
    marginTop: 15,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc400'
  },
  signTxt: {
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
    width: width(65),
    flexDirection: 'row',
    marginTop: 20
  },
  other: {
    height: height(5.5),
    width: width(30),
    resizeMode: 'cover',
    alignSelf: 'flex-start'
  },
  expTxt: {
    // fontFamily: FONT_NORMAL,
    fontSize: 12,
    color: 'black'
  },
  signUpT: {
    height: height(3),
    fontWeight: 'bold',
    fontSize: 12,
    textDecorationLine: 'underline',
    marginHorizontal: 5,
    color: 'black',
  },
  footer: {
    height: height(7),
    width: width(65),
    justifyContent: 'center',
    flexDirection: 'row'
  },
});

export default styles;
