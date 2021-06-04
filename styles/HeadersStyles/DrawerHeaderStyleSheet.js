import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { FONT_NORMAL, FONT_BOLD, COLOR_PRIMARY, COLOR_ORANGE } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../source/helpers/Responsive'
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent'
  },
  overlyHeader: {
    height: wp(20),
    width: '100%',
    // zIndex:1000,
    // position:'absolute',
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  drawerBtnCon: {
    height: wp(10),
    width: wp(10),
    justifyContent: 'center',
    alignSelf: 'center'
  },
  drawerBtn: {
    height: height(2.5),
    width: width(15),
    resizeMode: 'contain',
    alignSelf: 'center',
    // backgroundColor:'green',

  },
  headerTxtCon: {
    height: wp(10),
    width: wp(78),
    flexDirection: 'row',
    // backgroundColor:'green',
    alignSelf: 'center',
    // justifyContent:'center',
  },
  headerTxt: {
    fontSize: totalSize(2),
    color: '#ffffff',
    alignSelf: 'flex-start'
  },
  headerSearch: {
    height: height(3.2),
    width: width(15),
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  cart: {
    height: height(3.2),
    width: width(15),
    resizeMode: 'contain',
    alignSelf: 'center'
  },

});

export default styles;
