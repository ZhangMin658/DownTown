import React, { Component } from 'react';
import { Platform,StyleSheet } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, buttonText,exploreMoreText, SloganText, COLOR_SECONDARY } from './common';

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
  logoView: {
    height: height(55),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    height: height(7),
    width: width(51.5),
    resizeMode: 'contain',
    marginVertical: 20
  },
  logoTxt: {
    lineHeight: 30,
    width: width(60),
    marginHorizontal: 10,
    textAlign: 'center',
    marginTop: 7,
    fontSize: SloganText,
    color: 'white'
  },
  buttonView: {
    height: Platform.OS==='ios'?height(30):height(33),
    alignItems: 'center',
  },
  signInBtn: {
    height: height(6),
    width: width(65),
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(172, 172, 172, 0.2)',
    borderColor: 'rgba(172, 172, 172, 0.5)',
    borderWidth: 1
  },
  signUpBtn: {
    height: height(6),
    width: width(65),
    marginTop: 10,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc400'
  },
  signTxt: {
    fontWeight: 'bold',
    fontSize: buttonText,
    color: COLOR_PRIMARY,
  },
  signUpTxt: {
    fontWeight: 'bold',
    fontSize: buttonText,
    color: COLOR_PRIMARY,
  },
  expTxt: {
    // height: height(10),
    width: width(65),
    textAlign: 'center',
    marginTop: 7,
    fontWeight: 'bold',
    fontSize: exploreMoreText,
    color: COLOR_SECONDARY
  }
});

export default styles;
