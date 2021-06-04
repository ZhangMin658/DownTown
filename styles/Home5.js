import { StyleSheet, Platform, Dimensions, I18nManager } from 'react-native';
import { COLOR_SECONDARY, COLOR_ORANGE, COLOR_PRIMARY, COLOR_RED, S2, S16, SloganText,S14,smallTitle ,headingText,homeTitle, titleText,eventTitleText,ListingOnOffBtn,InputTextSize,ListingTitle, headerText,} from './common';
import { width, height, totalSize } from 'react-native-dimension';
import { widthPercentageToDP as wp } from '../source/helpers/Responsive';
const window = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width:widthPercentageToDP
  },
  IndicatorCon: {
    height: height(100),
    width: width(100),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  subCon: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  overlyHeader: {
    height: height(8),
    width: width(100),
    zIndex: 1000,
    position: 'absolute',
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center'
  },
  drawerBtnCon: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  drawerBtn: {
    height: height(2.6),
    width: width(15),
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  headerTxtCon: {
    flex: 4,
    alignSelf: 'center',
    justifyContent: 'center',
  },
  headerTxt: {
    fontWeight: 'bold',
    fontSize: totalSize(S2),
    color: '#ffffff',
  },
  headerSearch: {
    height: height(3.2),
    width: width(15),
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  cart: {
    height: height(3.2),
    width: width(15),
    flex: 1,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  topViewCon: {
    alignSelf: 'center',
    overflow: 'hidden',
    height: height(6),
    // backgroundColor:'red',
    // backgroundColor:'red',
    width: '100%',
    // overflow: 'hidden',
    // backgroundColor:'red' 
  },
  InnerRadius: {
    borderRadius: window.width,
    width: width(100) * 2,
    height: width(100) * 2.5,
    marginLeft: -(width(100) / 2),
    position: 'absolute',
    bottom: 0,
    overflow: 'hidden',
    // backgroundColor:'orange'
  },
  imageCon: {
    height: 30,
    width: width(100),
    backgroundColor:'red',
    position: 'absolute',
    bottom: 0,
    marginLeft: width(100) / 2,
    // backgroundColor: 'black'
  },
  findTxtCon: {
    height: 100,
    width: width(90),
    justifyContent: 'flex-end',
    alignItems:'flex-start'
  },
  firTxt: {
    fontWeight: 'bold',
    fontSize: homeTitle,
    color: '#ffffff'
  },
  secTxt: {
    alignSelf:'flex-start',
    marginHorizontal: 20,
    fontSize: smallTitle,
    marginVertical: 2,
    lineHeight: 20,
    textAlignVertical: 'center',
    color: '#ffffff'
  },
  searchCon: {
    height: 45,
    width: width(90),
    backgroundColor: '#ffffff',
    borderRadius: 4,
    marginVertical: 2,
    flexDirection: 'row'
  },
  txtInput: {
    fontSize: InputTextSize,
    width: width(80),
    height: 42,
    margin: 2,
    paddingHorizontal: 5,
    textAlign: 'left',
  },
  searchIcon: {
    height: height(2.5),
    width: width(8),
    resizeMode: 'contain',
    alignSelf: 'center',
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  },
  flatlistCon: {
    // height: height(43),
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    // position: 'absolute',
    alignItems: 'flex-end',
    // marginTop: Platform.OS === 'ios' ? 150 : 140,
  },
  flatlistChild: {
    // height: width(6),
    // width: width(10),
    // zIndex:-1,

    // marginVertical: 15,
    // marginBottom:5,
    // alignSelf: 'center',
    // alignItems: 'center',
    // justifyContent: 'center',
    // backgroundColor: 'white',
    // borderRadius: width(8),
    // ...Platform.select({
    //   ios: { shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: 2 },
    //   android: { elevation: 2, }
    // }),
  },
  cateCon: {
    height: height(30),
    width: width(44),
    marginBottom: 10,
    alignSelf: 'center',
    marginRight: 8,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 5,
    ...Platform.select({
      ios: { shadowColor: 'gray', shadowOpacity: 0.3, shadowRadius: 5 },
      android: { elevation: 5, }
    }),
  },
  featuredFLItemBox: {
    alignSelf:'center',
    marginHorizontal: 5,
    ...Platform.select({
      ios: { shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: 2 },
      android: { elevation: 2, }
    }),
    width: wp(30),
    // marginRight:wp('5'),
    // flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: wp('2'),
    marginVertical: 5,
    marginBottom: 6
  },
  txtViewConBox: {
    height:wp('26'),
    borderBottomLeftRadius:wp('2'),
    borderBottomRightRadius:wp('2'),

    backgroundColor:'#fff',
    width: width(45),
    justifyContent: 'center'
  },
  txtViewHeadingBox: {
    textAlign: 'left',
    fontWeight: 'bold',
    // backgroundColor:'red',
    // height: height(6),
    width: width(40),
    marginTop: 3,
    marginBottom: 1,
    marginLeft: 10,
    fontSize: ListingTitle, //totalSize(S16)
    color: 'black',
  },
  childImg: {
    height: height(8),
    width: width(15),
    borderRadius: 5,
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  childTxt: {
    // fontFamily: FONT_NORMAL,
    // width: width(16),
    // marginLeft:5,
    fontSize: smallTitle, //totalSize(S15)
    alignSelf: 'center',
    textAlign: 'center',
    color: COLOR_SECONDARY,
    // backgroundColor:'red',
    marginVertical: 5
  },
  recList: {
    fontWeight: 'bold',
    fontSize: SloganText, //totalSize(S2)
    color: 'black',
    // textDecorationLine:'underline',
  },
  latestFeature: {
    // textAlignVertical:'center',
    fontSize: totalSize(S14),
    color: 'black',
    // marginHorizontal: 5
  },
  featuredFLItem: {
    alignSelf:'center',
    marginHorizontal: 5,
    ...Platform.select({
      ios: { shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: 2 },
      android: { elevation: 2, }
    }),
    height: 104,
    width: width(90),
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 15,
    marginVertical: 5,
    marginBottom: 6
  },
  featuredImg: {
    height:'100%',width:'100%',
    // borderRadius:30,
    alignSelf:"center"
   
    
  },
  closedBtn: {
    // height:height(3),
    // width:width(18),
    borderRadius: 4,
    backgroundColor: COLOR_ORANGE,
    marginTop: 10,
    marginLeft: 10,
    justifyContent: 'center'
  },
  closedBtnTxt: {
    marginHorizontal: 7,
    marginVertical: 3,
    color: COLOR_PRIMARY,
    fontSize: ListingOnOffBtn, //totalSize(S15)
    // alignSelf:'center'
  },
  txtViewCon: {
    height: 98,
    width: width(55),
    justifyContent: 'center'
  },
  txtViewHeading: {
    textAlign: 'left',
    fontWeight: 'bold',
    // backgroundColor:'red',
    // height: height(6),
    width: width(55),
    marginTop: 3,
    marginBottom: 1,
    marginLeft: 10,
    fontSize: ListingTitle, //totalSize(S16)
    color: 'black',
  },
  subHeadingTxt: {
    marginTop: 0,
    marginLeft: 10,
    fontSize: 11, //totalSize(S15),
    textAlign: 'left',
    // width: width(50)
  },
  ratingCon: {
    // height: height(8),
    marginTop: 3,
    width: width(55),
    flexDirection: 'row',
  },
  ratingStyle: {
    height: height(3),
    width: width(18),
    alignItems: 'center',
    flexDirection: 'row',
    marginLeft: 10,
    
  },
  gradingCon: {
    // height: height(3),
    width: width(22),
    justifyContent: 'center',
  },
  ratingTxt: {
    marginHorizontal: 2,
    marginVertical: 3,
    fontSize: 11, //totalSize(S15)
    color: '#8a8a8a',
  },
  triangleCorner: {
    width: width(3),
    height: height(3),
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 32,
    borderTopWidth: 32,
    borderLeftColor: 'transparent',
    borderTopColor: 'red',

  },
  cate_con: {
    height: height(8),
    width: width(90),
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center'
  },
  readMoreBtnCon: {
    height: 24,
    // width: width(22),
    // borderRadius: 3,
    // borderColor: COLOR_ORANGE,
    alignSelf: 'center',
    // borderWidth: 0.8,
    alignItems: 'center',
    justifyContent: 'center'
  },
  cate_img: {
    height: height(30),
    width: width(44),
    borderRadius: 5,
    overflow: 'hidden'
  },
  cate_name: {
    backgroundColor: COLOR_RED,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 3
  },
  cateNameText: {
    marginHorizontal: 5,
    marginVertical: 3,
    fontSize: 8,
    fontWeight:'bold',
    color: COLOR_PRIMARY
  },
  eventTitle: {
    fontSize: 12,
    color: COLOR_PRIMARY,
    fontWeight: 'bold',
    marginVertical: 2,
    marginHorizontal: 10,
    // marginLeft:
    textAlign: 'left'
  },
  locIcon: {
    height: height(2.5),
    width: width(5),
    resizeMode: 'contain',
    marginRight: 5,
    transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]
  },
  locText: {
    fontSize: 10,
    color: COLOR_PRIMARY,
    marginRight: 5
  },
  exploreBtn: {
    height: height(7),
    width: width(100),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLOR_ORANGE
  },
  cate_text: {
    fontSize: 8,
    color: COLOR_PRIMARY,
    marginRight: 1
  },
  btnIcon: {
    height: height(2.5),
    width: width(8),
    resizeMode: 'contain',
    alignSelf: 'center'
  },
  explorebtnTxt: {
    // fontFamily: FONT_NORMAL,
    fontSize: totalSize(S16),
    color: '#ffffff'
  },
});

export default styles;