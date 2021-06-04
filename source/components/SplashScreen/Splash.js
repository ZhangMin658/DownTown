import React, { Component } from 'react';
import { Alert, BackHandler, ActivityIndicator, I18nManager, Platform, StyleSheet, Text, View, Image, ImageBackground, AsyncStorage } from 'react-native';
import { INDICATOR_COLOR, INDICATOR_SIZE, OVERLAY_COLOR } from '../../../styles/common';
import { width, height, totalSize } from 'react-native-dimension';
import styles from '../../../styles/SplashStyleSheet'
import { observer } from 'mobx-react';
import Store from '../../Stores';
import Toast from 'react-native-simple-toast';
import ApiController from '../../ApiController/ApiController';
import NetInfo from "@react-native-community/netinfo";
import RNRestart from 'react-native-restart'
import LocalDb from '../../LocalDB/LocalDB';
import firebase from 'react-native-firebase';

@observer export default class Splash extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      nointernet: false
    }
  }
  static navigationOptions = { header: null };
  splash = async () => {
    let { orderStore } = Store;
    orderStore.settings = null;
    // API calling...
    this.setState({ loading: true })
    let response = await ApiController.post('settings');
    console.log('settings=', response);

    I18nManager.forceRTL(response.data.is_rtl)
    if (response.data.is_rtl) {
      if (I18nManager.isRTL) {

      } else {
        RNRestart.Restart()
      }
    } else if (response.data.is_rtl == false) {
      if (I18nManager.isRTL) {
        RNRestart.Restart()

      } else {
      }
    }
    // console.log('is rtl',I18nManager.isRTL)

    orderStore.settings = response;
    if (orderStore.settings.success === true) {

      orderStore.statusbar_color = orderStore.settings.data.navbar_clr;
      orderStore.wpml_settings = orderStore.settings.data.wpml_settings

      AsyncStorage.getItem('email').then((value)=>{
        if(value == null)
        {
          this.props.navigation.replace('Welcome'); //Welcome Screen
        }else{
          this.props.navigation.replace('Drawer'); //MainScreen
        }
      });     
      
      this.setState({ loading: false })
    } else {
      Toast.show('Check your internet and try again', Toast.LONG);
    }

            
    let selected_city = await AsyncStorage.getItem('selected_city')
    if(selected_city != null)
    {
      store.CUR_CITY = JSON.parse(selected_city);
    }
  }
  componentWillMount = async () => {
    // if (NetInfo.isConnected) {

    // }
    // else {
    // }
    // NetInfo.isConnected.fetch().then(async isConnected => {
    //   if (isConnected) {
        await this.splash(true)
        await this.manageFcmToken();
    //   } else {
    //     this.setState({ nointernet: true })

    //   }
    // });

  }


  manageFcmToken = async () => {
    //console.warn("inside");

    let { orderStore } = Store;
    const fcmToken = await firebase.messaging().getToken();
    // console.log('fcmtoken',fcmToken)
    // if (fcmToken) { 
    //   const userData = await LocalDb.getUserProfile();
    // //  console.warn(userData.id)          
    //     const params = {firebase_id:fcmToken,user_id:userData.id};

    //  console.warn("home Params==>",JSON.stringify(params));

    //   const response  = await Api.post('home',params);
    //   console.log("Home response===>",response);
    //  // console.warn("Response==>",JSON.stringify(response));
    //    if(response.success === true)
    //     orderStore.fcmToken = fcmToken;
    //   else
    //    { if(response.message.length!=0)
    //      Toast.show(response.message);}
  }



  // componentDidMount() {
  //   NetInfo.isConnected.addEventListener(
  //     'connectionChange',
  //     (isConnected) => { isConnected ? this.splash(false) : this.alert() }
  //   );
  // }
  alert() {
    this.setState({ loading: true, alertStatus: true })
    Alert.alert(
      'Connection Error',
      'Check your internet connection and try again',
      [
        // {text: 'Ask me later', onPress: () => console.log('Ask me later pressed')},
        // { text: 'Exit', onPress: () =>  this.exit()},
        { text: 'Retry', onPress: () => this.internetCheck() }
      ],
      { cancelable: false }
    )
  }
  exit = () => BackHandler.exitApp();
  internetCheck() {
    NetInfo.isConnected.fetch().then(isConnected => {
      (isConnected ? alert('Internet is connected') : this.alert());
    });
  }
  render() {

    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../images/bk_ground.jpg')} style={styles.imgCon}>
          <ImageBackground source={require('../../images/Downtown_Shadownew.png')} style={styles.imgCon}>
            <View style={styles.LogoCon}>
              <Image source={require('../../images/splash_logo.png')} />
              <Text style={styles.slogoTitle}>Find & Explore World Top Places</Text>
            </View>
            <View style={styles.IndicatorCon} >
              {
                this.state.loading === true ?
                  <ActivityIndicator size={INDICATOR_SIZE} color='#e52d27' animating={true} hidesWhenStopped={true} />
                  :
                  null
              }
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  }
}