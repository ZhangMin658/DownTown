import { Platform,I18nManager, StyleSheet } from 'react-native';
import { COLOR_PRIMARY, smallText, socialBtnText,buttonText,SloganText,InputTextSize,SignInHeaderText, COLOR_SECONDARY } from './common';
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
    width: width(17),
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  backBtn: {
    height: height(3),
    width: width(5),
    marginLeft: 25,
    resizeMode: 'contain',
    transform: [{ scaleX: I18nManager.isRTL ? -1 : 1 }], //RTL of icons 
  },
  headerTxt: {
    fontSize: SignInHeaderText,
    color: 'white',
    fontWeight: 'bold',
    alignSelf: 'flex-end',
    paddingEnd: 30,
  },
  logoView: {
    height: height(35),
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImg: {
    height: height(7.6),
    width: width(55.8),
    resizeMode: 'contain'
  },
  logoTxt: {
    height: height(12),
    width: width(65),
    textAlign: 'center',
    // fontFamily: FONT_NORMAL,
    marginTop: 25,
    fontSize: SloganText,
    color: COLOR_PRIMARY
  },
  buttonView: {
    height: Platform.OS==='ios'? height(45):height(50),
    alignItems: 'center',
  },
  userImg: {
    height: height(3.7),
    width: width(5),
    marginHorizontal: 15
  },
  mail: {
    height: height(5.5),
    width: width(5.5),
    marginHorizontal: 15,
  },
  btn: {
    height: height(6.3),
    width: width(80),
    flexDirection: 'row',
    borderRadius: 3,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(172, 172, 172, 0.2)',
    borderColor: 'rgba(172, 172, 172, 0.5)',
    borderWidth: 1,
    marginVertical: 5
  },
  inputTxt: {
    alignSelf: 'stretch',
    height: height(6),
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    textAlignVertical: 'center',
    fontSize: InputTextSize,
    color: COLOR_PRIMARY,

  },
  signUpBtn: {
    height: height(6.3),
    width: width(80),
    marginTop: 15,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffc400'
  },
  signTxt: {
    fontWeight: 'bold',
    // fontFamily: FONT_BOLD,
    fontSize: buttonText,
    color: COLOR_PRIMARY,
  },
  signUpTxt: {
    fontWeight: 'bold',
    fontSize: buttonText,
    color: COLOR_PRIMARY,
  },
  fgBtn: {
    height: height(5.5),
    width: width(80),
    flexDirection: 'row',
    marginTop: 20
  },
  socialBtnText: {
    fontSize: socialBtnText, color: 'white' 
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
    fontSize: smallText,
    color: '#ffffff',
  },
  forgetpwrd: {
    height: height(3),
    width: width(30),
    textAlign: 'left',
    // fontFamily: FONT_NORMAL,
    fontSize: 12,
    color: 'black'
  },
  newHere: {
    // height: height(3),
    // width: width(20),
    textAlign: 'right',
    // fontFamily: FONT_NORMAL,
    fontSize: 12,
    color: 'black'
  },
  signInT: {
    height: height(3),
    width: width(13),
    // fontFamily: FONT_BOLD,
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 12,
    textDecorationLine: 'underline',
    color: COLOR_SECONDARY,
  },
  footer: {
    height: height(7),
    width: width(65),
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center'
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
    justifyContent:'center',
    alignItems :'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    width:width(80),
    paddingLeft: 25,
  },
  terms_txt : {
    color: COLOR_PRIMARY,
    fontWeight: 'normal',
    marginLeft: -5,
  }
});

export default styles;
