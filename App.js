import React, { Component } from 'react';
import { View, Platform, StatusBar, I18nManager, Image, BackHandler, Alert, Text } from 'react-native';
import AppMain from './source/app';
import { MenuProvider } from 'react-native-popup-menu';
import store from './source/Stores/orderStore';
import Store from './source/Stores';
import firebase, { NotificationOpen, Notification } from 'react-native-firebase';
import NetInfo from "@react-native-community/netinfo";

import LocalDB from './source/LocalDB/LocalDB'
import Storage from './source/LocalDB/storage'
import { observer } from 'mobx-react';

@observer
export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      color: 'black',
      loading: false,
      isInternetAvailable: false
    };

    this.unsubscribe = NetInfo.addEventListener(state => {

      if (!state.isConnected && state.details === null && !state.isInternetReachable)
        this.setState({ isInternetAvailable: false });
      else
        this.setState({ isInternetAvailable: true });

    });


    // I18nManager.forceRTL(false);
  }
  fucn() {
    var timerId = setInterval(() => {
      if (store.statusbar_color !== null) {
        // this.setState({ loading: false })
        clearInterval(timerId);
      } else {
        console.log('app.js')
      }
    }, 5000);
  }
  async componentDidMount() {
    NetInfo.isConnected.fetch().then(async isConnected => {
      if (isConnected) {





        await this.subToTopic();
        await this.createNotificationListeners();

        let { orderStore } = Store;

        /////////////////////////////////
        const channel = new firebase.notifications.Android.Channel(
          'channelId',
          'Channel Name',
          firebase.notifications.Android.Importance.Max
        ).setDescription('A natural description of the channel');
        firebase.notifications().android.createChannel(channel);

        firebase.messaging().hasPermission()
          .then(enabled => {

            if (enabled) {
              firebase.messaging().getToken().then(token => {
                orderStore.DEVICE_TOKEN = token
                // console.log("LOG: ", token);
              })

              if (Platform.OS === 'ios') {
                this.notificationListenerIOS = firebase.notifications().onNotification(notification => {
                  console.warn('notification===>>>', notification);

                  //Showing Local notification IOS
                  const localNotification = new firebase.notifications.Notification()
                    .setNotificationId(notification._notificationId)
                    .setTitle(notification.title)
                    .setSubtitle(notification.subtitle)
                    .setBody(notification.body)
                    .setData(notification.data)
                    .ios.setBadge(1);

                  firebase.notifications()
                    .displayNotification(localNotification)
                    .catch(err => console.error(err));
                })
              } else {
                this.notificationListenerANDROID = firebase.notifications().onNotification(notification => {
                  //Showing local notification Android
                  console.log('notification===>>>', notification);
                  const localNotification = new firebase.notifications.Notification({
                    sound: 'default',
                    show_in_foreground: true
                  })
                    .setNotificationId(notification.notificationId)
                    .setTitle(notification.title)
                    .setSubtitle(notification.subtitle)
                    .setBody(notification.body)
                    .setData(notification.data)
                    .android.setAutoCancel(true)
                    .android.setChannelId('channelId') // e.g. the id you chose above
                    // .android.setSmallIcon('ic_stat_notification') // create this icon in Android Studio
                    .android.setColor('#000000') // you can set a color here
                    .android.setPriority(firebase.notifications.Android.Priority.High);

                  firebase.notifications()
                    .displayNotification(localNotification)
                    .catch(err => console.error(err));
                  // console.log('notification===>>>', notification);
                })
              }
            } else {
              firebase.messaging().requestPermission()
                .then(() => {
                  firebase.messaging().registerForNotifications()
                  alert("User Now Has Permission")
                })
                .catch(error => {
                  console.log(error)
                  //  alert("Error", error)
                  // User has rejected permissions  
                });
            }

          });

        ////////////////////////////////////

        setTimeout(() => { this.setState({ color: store.statusbar_color }) }, 9000)
        // await LocalDB.saveHomepage(1);


        Storage.getItem('language').then((value) => {
          if (value == null) {
            Storage.setItem('language', "en")
          }
        })

        Storage.getItem('issocial').then((value) => {
          if (value != undefined) {
            if (value != null) {
              if (value == true) {
                orderStore.LOGIN_SOCIAL_TYPE = 'social'
              }
            } else {

            }
          }
        })


        Storage.getItem('homepage').then((value) => {
          // if(value==null){
          Storage.setItem('homepage', 8)
          // }
        })

      } else {
        this.setState({ isInternetAvailable: false })

      }
    });
  }
  componentWillUnmount() {
    this.unsubscribe()
  }
  showAlert(title, body) {
    Alert.alert(
      title, body,
      [
        { text: 'OK', onPress: () => console.log('OK Pressed') },
      ],
      { cancelable: false },
    );
  }
  async subToTopic() {
    let topic = 'global';
    firebase.messaging().subscribeToTopic(topic);
  }

  async createNotificationListeners() {
    // console.warn('called');



    firebase.notifications().onNotificationDisplayed((notification: Notification) => {
      // Process your notification as required
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      console.log('inside onNotificationDisplayed');
    });


    /*
    * Triggered when a particular notification has been received in foreground
    * */
    firebase.notifications().onNotification((notification) => {
      const { title, body } = notification;
      this.showAlert(title, body);
      console.log('inside onNotificaion', title);
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    firebase.notifications().onNotificationOpened((notificationOpen) => {
      const { title, body } = notificationOpen.notification;

      this.showAlert(title, body);
      console.log('inside onNotificaion Opened', title);
    });

    /*
    * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
    * */
    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
      const { title, body } = notificationOpen.notification;
      this.showAlert(title, body);
      console.log('inside onInitial Notificaion', title);
    }

  }
  // async createNotificationListeners() {
  //   // console.warn('called');



  //   firebase.notifications().onNotificationDisplayed((notification: Notification) => {
  //     // Process your notification as required
  //     // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
  //     console.log('inside onNotificationDisplayed');
  //   });


  //   /*
  //   * Triggered when a particular notification has been received in foreground
  //   * */
  //   firebase.notifications().onNotification((notification) => {
  //     const { title, body } = notification;
  //     // this.showAlert(title, body);
  //     console.log('inside onNotificaion', title);
  //   });

  //   /*
  //   * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
  //   * */
  //   firebase.notifications().onNotificationOpened((notificationOpen) => {
  //     const { title, body } = notificationOpen.notification;

  //     // this.showAlert(title, body);
  //     console.log('inside onNotificaion Opened', title);
  //   });

  //   /*
  //   * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
  //   * */
  //   const notificationOpen = await firebase.notifications().getInitialNotification();
  //   if (notificationOpen) {
  //     // const { title, body } = notificationOpen.notification;
  //     // this.showAlert(title, body);
  //     // console.log('inside onInitial Notificaion', title);
  //   }

  // }
  render() {

    if (!this.state.isInternetAvailable) {
      return (
        <View style={{ width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', backgroundColor: 'white' }}>
          <Image source={require('./source/images/no_wifi.png')}
            style={{ resizeMode: 'center' }}
          />
          <Text style={{ color:'#686868' , fontWeight: 'bold' }} >Connection Error</Text>
        </View>
      )
    } 
      return (

        <MenuProvider>
          <StatusBar
            hidden={false}
            animated={true}
            backgroundColor={this.state.color}
            barStyle="light-content"
            networkActivityIndicatorVisible={Platform.OS === 'ios' ? false : false}
            showHideTransition={Platform.OS === 'ios' ? 'slide' : null}
          />
          <AppMain />
        </MenuProvider>
      );
    
  }
}
