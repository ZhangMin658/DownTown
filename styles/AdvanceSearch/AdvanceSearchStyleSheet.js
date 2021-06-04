import { StyleSheet, Platform } from 'react-native';
import { COLOR_PRIMARY, COLOR_SECONDARY, COLOR_RED, COLOR_GRAY, COLOR_TRANSPARENT_BLACK, COLOR_ORANGE, COLOR_BROWN, COLOR_YELLOW, COLOR_PINK, COLOR_LIGHT_BLUE } from '../common';
import { width, height, totalSize } from 'react-native-dimension';
const buttonTxt = 1.8;
const paragraphTxt = 1.5;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
const fieldCOLOR = 'rgba(211,211,211,0.3)';
const styles = StyleSheet.create({
  container: {
    // height:'100%',width:'100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  containerImg: {
    height:'100%',width:'100%',
    // flex: 1,
    alignSelf: 'stretch'
  },
  ImgSubCon: {
    flex: 1,
    // height:'100%',width:'100%',
    justifyContent:'center',
    alignContent:'center',alignItems:'center'
    // backgroundColor: COLOR_TRANSPARENT_BLACK
  },
  subConView: {
    // flex: 1,
    height:'100%',width:'100%',
    alignSelf: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 15,
  },
  textInputCon: {
    // height: height(8),
    width: width(90),
    marginVertical: 10,
    justifyContent: 'center',
    alignSelf:'center'
  },
  textInput: {
    height: height(8),
    width: width(90),
    backgroundColor: 'transparent',
    color: COLOR_SECONDARY,
    fontSize: totalSize(titles),
    padding: 0,
    alignSelf: 'center'
  },
  pickerCon: {
    height: height(6),
    width: width(90),
    marginVertical: 10,
    justifyContent: 'center',
  },
  sliderTitle: {
    height: height(13), width: width(90), justifyContent: 'flex-end', marginVertical: 10
  },
  subConSliderTitle: {
    height: height(3), width: width(90), flexDirection: 'row'
  },
  radiusLabel: {
    fontSize: totalSize(titles), fontWeight: 'bold', color: COLOR_SECONDARY, textDecorationLine: 'underline'
  },
  numberLabel: {
    fontSize: totalSize(titles), fontWeight: 'bold', color: COLOR_SECONDARY
  },
  amentiesCon: {
    height: height(4), width: width(90), justifyContent: 'center'
  },
  chekBoxCon: {
    flex: 1, marginHorizontal: 10, flexDirection: 'row', flexWrap: 'wrap', marginVertical: 5,
  },
  btnCon: {
     height: height(6), width: width(90), marginHorizontal: 10, marginVertical: 15, justifyContent: 'center', alignItems: 'center', borderRadius: 5, backgroundColor: COLOR_ORANGE, alignSelf:'center'
  },
  btnText: {
    fontSize: totalSize(headingTxt), fontWeight: 'bold', color: COLOR_PRIMARY
  },

});

export default styles;
