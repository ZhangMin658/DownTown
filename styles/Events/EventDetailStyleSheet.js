import React, { Component } from 'react';
import { StyleSheet, Platform } from 'react-native';
import { COLOR_PRIMARY, COLOR_GRAY, COLOR_SECONDARY, COLOR_ORANGE ,COLOR_BACKGROUND, S16, S18, S15, S14 } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: COLOR_BACKGROUND
  },
  subCon: {
    flex: 1,
    margin: 10
  },
  mapCon: {
    height: height(40),
    width: width(95),
    alignSelf: 'center',
    marginVertical: 10
  },
  map: {
    height: height(40),
    width: width(95),
    zIndex: -10,
    position: 'absolute',
    alignSelf: 'center'
  },
  imageItem: {
    height: height(10),
    width: width(25),
    alignSelf: 'center',
    resizeMode: 'stretch',
    marginRight: 5
  },
  tableCon: {
    flex: 1,
    borderWidth: 0.5,
    borderColor: COLOR_GRAY
  },
  tableRowCon: {
    height: height(10),
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: COLOR_GRAY
  },
  tableHeaderText: {
    color: COLOR_SECONDARY,
    fontWeight: 'bold',
    marginHorizontal: 10
  },
  middleRowCon: {
    height: height(6),
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderColor: COLOR_GRAY,
    flexDirection: 'row'
  },
  rowIcon: {
    height: height(2.5),
    width: width(5),
    resizeMode: 'contain',
    marginLeft: 20
  },
  tableText: {
    fontSize: totalSize(S16),
    color: COLOR_SECONDARY,
    marginHorizontal: 5
  },
  timmerCon: {
    height: height(10),
    justifyContent: 'center',
    alignItems: 'center'
  },
  disTitle: {
    fontSize: totalSize(S18),
    color: COLOR_SECONDARY,
    fontWeight: 'bold'
  },
  disText: {
    fontSize: totalSize(S15),
    color: COLOR_GRAY,
    marginHorizontal: 10,
    marginVertical: 5
  },
  profileCon: {
    height: height(10),
    backgroundColor: 'rgba(211,211,211,0.4)',
    flexDirection: 'row'
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
    textAlign:'left'
  },
  viewBtn: {
    width: width(30),
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewBtnCon: {
    height: height(4),
    // width: width(25),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLOR_SECONDARY,
    borderRadius: 3
  },
  viewBtnText: {
    fontSize: totalSize(S14),
    color: COLOR_PRIMARY,
    fontWeight: 'bold',
    marginHorizontal: 5
  },
  commentTitle: {
    fontSize: totalSize(S18),
    fontWeight: 'bold',
    color: COLOR_SECONDARY
  },
  commentAuthName: {
    fontSize: totalSize(S18),
    fontWeight: 'bold',
    color: COLOR_SECONDARY
  },
  commentDate: {
    fontSize: totalSize(S14),
    // color: COLOR_SECONDARY
  },
  commentContent: {
    marginVertical: 5,
    // fontSize: totalSize(S14),
    // color: COLOR_GRAY
  },
  textInputCon: {
    height: height(12),
    marginVertical: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  textInput: {
    alignSelf: 'stretch',
    width: width(95),
    textAlignVertical: 'top',
    paddingLeft: 10,
    color: COLOR_SECONDARY,
    fontSize: totalSize(S15),
    borderColor: COLOR_GRAY,
    borderWidth: 1,
    borderRadius: 3
  },
  submitBtnCon: {
    height: height(6),
    marginVertical: 5,
    backgroundColor: COLOR_ORANGE,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  submitBtnText: {
    fontSize: totalSize(S18),
    color: COLOR_PRIMARY
  },

});

export default styles;
