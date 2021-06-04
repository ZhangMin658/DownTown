import React, { Component } from 'react';
import { StyleSheet, Platform, I18nManager } from 'react-native';
import { COLOR_PRIMARY, COLOR_SECONDARY, COLOR_RED, COLOR_GRAY, COLOR_ORANGE, COLOR_BROWN, COLOR_YELLOW, COLOR_PINK, COLOR_LIGHT_BLUE } from './common';
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
  subCon: {
    flex: 1,
    marginHorizontal: 10,
    marginTop: 5,
    marginVertical: 15,
  },
  rateDropdown: {
    height: height(6),
    width: width(95),
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderColor: COLOR_GRAY,
    marginBottom: 0.5
  },
  rateTxt: {
    width: width(76),
    // fontFamily: FONT_BOLD,
    fontWeight: 'bold',
    fontSize: totalSize(titles),
    color: 'black',
    marginHorizontal: 15,
    ...Platform.select({
      ios: { paddingTop: 12 },
      android: { textAlignVertical: 'center' }
    }),
  },
  dropDownImg: {
    height: height(2.5),
    width: width(15),
    resizeMode: 'contain',
    alignSelf: 'center',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  },
  headerDropdown: {
    elevation: 10, flex: 1, marginVertical: 10, justifyContent: 'center', alignItems: 'center'
  },
  stripCon: {
    height: height(5),
    width: width(95),
    flexDirection: 'row',
    backgroundColor: 'white',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    marginBottom: 0.5,
    borderColor: COLOR_GRAY
  },
  ratingText: {
    height: height(3), width: width(15), paddingLeft: 5, fontSize: totalSize(1.4), color: 'black'
  },
  startScoreText: {
    height: height(3),
    width: width(15),
    paddingLeft: 10,
    fontSize: totalSize(1.3),
    color: 'black'
  },
  ratingDetail: {
    flex: 1,
    width: width(95),

  },
  personDetail: {
    height: height(15),
    width: width(95),
    flexDirection: 'row'
  },
  imgCon: {
    height: height(15),
    width: width(25),
    justifyContent: 'center'
  },
  imgSubCon: {
    height: height(13),
    width: width(22),
    justifyContent: 'flex-end'

  },
  profileImg: {
    alignSelf: 'center',
    height: height(12),
    width: width(21),
    borderRadius: Platform.OS === 'ios' ? 42 : 100,
  },
  detailPerson: {
    height: height(16),
    width: width(60),
    justifyContent: 'center',
  },
  personName: {
    height: height(3),
    width: width(70),
    fontSize: totalSize(1.6),
    textAlign: 'left',
    color: 'red',
    textAlignVertical: 'center',
  },
  location: {
    height: height(3),
    width: width(70),
    fontSize: totalSize(1.8),
    textAlign: 'left',
    fontWeight: 'bold',
    color: COLOR_SECONDARY,
    textAlignVertical: 'center'
  },
  dateCon: {
    height: height(3),
    width: width(70),
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    borderRightWidth: 0.5,
    borderColor: COLOR_SECONDARY,
    fontSize: totalSize(1.4),
    color: COLOR_SECONDARY,
  },
  gradingCon: {
    width: width(25.5),
    height: 20,
  },
  flatlistChild: {
    height: height(8),
    width: width(20),
    margin: 0,
    justifyContent: 'center',
  },
  childImg: {
    height: height(7.5),
    width: width(18.5),
    alignSelf: 'center',
    backgroundColor: 'black'
  },
  professionalBtn: {
    textAlign: 'center',
    color: COLOR_PRIMARY,
    fontSize: totalSize(smallButtons),
    alignSelf: 'center',
    marginHorizontal: 5,
    marginVertical: 3
    // fontFamily:FONT_NORMAL
  },
  rating: {
    textAlign: 'center',
    color: 'black',
    marginRight: 15,
    fontSize: totalSize(smallButtons),
    alignSelf: 'center'
  },
  paragraph: {
    textAlign: 'left',
    color: 'black',
    alignSelf: 'flex-start',
    marginHorizontal: 10,
  },
  likeSectonTitle: {
    height: height(4),
    width: width(70),
    marginVertical: 5,
    color: COLOR_SECONDARY,
    // fontFamily:FONT_BOLD,
    fontSize: totalSize(titles),

  }
});

export default styles;
