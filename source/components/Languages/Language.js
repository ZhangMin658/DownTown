import React, { Component } from 'react';
import {
  Platform, StyleSheet,FlatList, Text, View,ImageBackground, Image, ScrollView, TouchableOpacity, Picker, ActivityIndicator, RefreshControl, I18nManager
} from 'react-native';

import { width, height, totalSize } from 'react-native-dimension';

import Toast from 'react-native-simple-toast';
import * as RNIap from 'react-native-iap';
import ApiController from '../../ApiController/ApiController';
import { COLOR_PRIMARY, COLOR_SECONDARY, iconsSize } from '../../../styles/common';
import store from '../../Stores/orderStore';
import styles from './style';

import { AsyncStorage } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP } from '../../helpers/Responsive';
import Storage from '../../LocalDB/storage'
import * as Animatable from 'react-native-animatable';

import RNRestart from 'react-native-restart'


const theme = {
  primaryBackgroundColor: 'white',
  secondaryBackgroundColor: 'white',
  primaryForegroundColor: 'blue',
  secondaryForegroundColor: 'orange',
  accentColor: 'green',
  errorColor: 'red'
};
let itemSkewsIos = ['dwt_business_plan', 'dwt_premium_plan'];
let itemSkewsAndroid = [];

let packgeIdIap = '';
let packageTypeIap = '';
const swing = {
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  },
};

const lang = [

  {
    code: "fr",
    native_name: "French",
    native_name: "French"
  },
  {
    code: "en",
    native_name: "English",
    native_name: "English"
  }

]
export default class Language extends Component<Props> {
  constructor(props) {
    super(props);
    this.inputRefs = {};
    this.state = {
      loading: false,
      name: '',
      favColor: 'red',
      is_picker: false,
      payment_methodes: [],
      payment_type: '',
      pkg_id: '',
      pkg_type: '',
      amount: '',
      currency: '',
      receipt: null,
      breaker: 0
    }
  }
  static navigationOptions = {
    header: null, 
  };

  async componentDidMount() {
    console.log("here props are",this.props)
    // await this.getPackages()
  }

  // requestPurchase = async (sku) => {
  //   try {
  //     RNIap.requestPurchase(sku);
  //   } catch (err) {
  //     console.log(err.code, err.message);
  //   }
  // }



  isLoggedIn = async () => {
    const email = await AsyncStorage.getItem('email');
    const pass = await AsyncStorage.getItem('password');

    if (email != null && pass != null) {
      return true
    }
    return false
  }




  _blog = (item, key) => {
    let main_clr = store.settings.data.main_clr;
    let data = store.PACKAGES_OBJ;
    return (
      <View key={key} style={styles.blogCon}>
        <Animatable.View
          ref="view"
          animation={'bounce'}
          style={{ width: width(80), alignItems: 'center', paddingVertical: wp('4') }}>
          <Animatable.Text tran animation={swing} style={{ color: '#6E768B', fontSize: wp(4) }}>{item.package_info.title}</Animatable.Text>
        </Animatable.View>


      </View>
    );
  }
  updateLanguage=(item)=>{
    // if(!=item.code){
      // console.log('item is',item.code)
      
      Storage.setItem('language',item.code)
      // Storage.getItem('language').then((val)=>{
      //   console.log('val is',val)
      // })
      RNRestart.Restart();
      
    // }/
  }
  render() {
    let main_clr = store.settings.data.main_clr;
    let data = store.wpml_settings;
    return (
      <ImageBackground 
      source={require('../../images/bg_language_select.jpg')}
      style={[styles.container]}>
        {
          this.state.loading ?
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={main_clr} size='large' animating={true} />
            </View>
            :
            <ScrollView
              style={{ alignContent: 'center' }}
              // backgroundColor='#f9f9f9'
              showsVerticalScrollIndicator={false}
              // refreshControl={
              //   <RefreshControl
              //     colors={['white']}
              //     progressBackgroundColor={store.settings.data.main_clr}
              //     tintColor={store.settings.data.main_clr}
              //     refreshing={this.state.refreshing}
              //     onRefresh={this.getPackages}
                // />
              // }
            >
              <View style={{marginTop:wp("10"),marginLeft:wp('10')}}>
                {/* <Text style={[{fontSize:wp('5'),fontWeight:'bold'},I18nManager.isRTL?{textAlign:'left'}:{}]}>اختار اللغة</Text> */}
                <Text style={[{fontSize:wp('5'),fontWeight:'bold'},I18nManager.isRTL?{textAlign:'left'}:{}]}>{data.sb_wpml_select_lang_title}</Text>
              </View>
              <FlatList
                data={data.wpml_site_languages}
                style={{ height: heightPercentageToDP('90'), top: '5%' }}
                renderItem={({ item }) =>
                  <TouchableOpacity 
                  onPress={()=>this.updateLanguage(item)}
                  style={styles.blogCon}>
                    <Animatable.View
                      ref="view"
                      animation={'bounce'}
                      style={{ flexDirection:'row',alignContent:'space-between',width: width(80), alignItems: 'center', paddingVertical: wp('4') }}>
                      <Animatable.Text tran animation={swing} style={{ color: '#6E768B', fontSize: wp(4),marginLeft:wp('10') }}>{item.native_name}</Animatable.Text>
                      <View style={{width:'30%',position:'absolute',right:wp('2'),alignContent:'center',alignItems:'center'}}>
                      <Image
                        source={{uri:item.lang_flag}}
                        resizeMode="contain"
                        style={{height:wp('10'),width:wp('10')}}
                      />
                      </View>
                      
                    </Animatable.View>


                  </TouchableOpacity>
                }
              />
            </ScrollView>
        }

      </ImageBackground>
    );
  }
}
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: totalSize(1.8),
    paddingLeft: 15,
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 12,
    color: COLOR_PRIMARY,
  },
  inputAndroid: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    color: COLOR_SECONDARY,
  }
});
