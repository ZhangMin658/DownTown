import React, { Component } from 'react';
import { Platform, SafeAreaView,I18nManager, StatusBar, View, BackHandler, Alert } from 'react-native';
import Route from './MainRoute/Route';
import Route2 from './MainRoute/Route02';
import Route3 from './MainRoute/Route03';
import Route4 from './MainRoute/Route04';
import Route5 from './MainRoute/Route05';
import Route6 from './MainRoute/Route06';
import Route7 from './MainRoute/Route07';
import Route8 from './MainRoute/Route08';
import Route9 from './MainRoute/Route09';
import Route10 from './MainRoute/Route10';
import Route11 from './MainRoute/Route11';
import Route12 from './MainRoute/RouteOld';
import { observer } from 'mobx-react';
import RNRestart from 'react-native-restart'
import store from './Stores/orderStore';
import Store from './Stores'
import { MenuProvider } from 'react-native-popup-menu';
import Storage from '../source/LocalDB/storage'
import ApiController from './ApiController/ApiController'
// import LocalDB from '../source/LocalDB/LocalDB'
export default class AppMain extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      color: 'black',
      loading: false,
      move: false,
      current: 0
    };
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

  splash = async () => {
    let { orderStore } = Store;
    orderStore.settings = null;
    // API calling...
    this.setState({ loading: true })
    let response = await ApiController.post('settings');
    // console.log('settings in app..js=', response);
    // orderStore.settings = response;
    if (response.success === true) {
      // Storage.getItem('homepageChangeCounter').then((res) => {
        // if (res != null) {
          // if(res<3)
          // {
            //  Storage.getItem('homepage').then((resx) => {
              // if (resx != null) {
                // this.setState({ move: true, current: resx })
                // Storage.setItem('homepageChangeCounter',res+1)
                // console.log('resxxx', res)
              // }
            // })
          // }else{
            // if(true)
            // {
              
            //   if(!I18nManager.isRTL)
            //     RNRestart.Restart();
            // }
            // if(!data.is_rtl)
            // {
            //   if(I18nManager.isRTL)
            //   RNRestart.Restart();
              
            // }
            // this.setState({ move: true, current: 12 })
            this.setState({ move: true, current: Number(response.data.home_theme_type) })
            // alert(response.data.home_theme_type);
            // console.log(response.data);
          // }
          // console.log('resxxx', res)
        // }else{
          // Storage.setItem('homepageChangeCounter',0)
          // this.setState({ move: true, current: Number(response.data.home_theme_type) })

        // }
      // })
      // if(Number(orderStore.settings.data.home_theme_type))
      // orderStore.statusbar_color = orderStore.settings.data.navbar_clr;
      // this.props.navigation.replace('Drawer'); //MainScreen
      // this.setState({ loading: false })
    } else {
      Toast.show('Check your internet and try again', Toast.LONG);
    }
  }

  async componentDidMount() {
    setTimeout(() => { this.setState({ color: store.statusbar_color }) }, 9000)
    await this.splash()
    // Storage.getItem('homepage').then((res) => {
    //   if (res != null) {
    //     this.setState({ move: true, current: res })
    //     console.log('resxxx', res)
    //   }
    // })
  }



  render() {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: this.state.color }}>
        {
          this.state.move ? [
            this.state.current == 1 ? [
              <Route />
            ] : [
                this.state.current == 2 ? [
                  <Route2 />
                ] : [
                    this.state.current == 3 ?
                      [
                        <Route3 />
                      ] : [
                        this.state.current == 4 ?
                          [
                            <Route4 />
                          ] : [
                            this.state.current == 5 ?
                              [
                                <Route5 />
                              ] : [
                                this.state.current == 6 ?
                                  [
                                    <Route6 />
                                  ] : [
                                    this.state.current == 7 ?
                                      [
                                        <Route7 />
                                      ] : [
                                        this.state.current == 8 ?
                                          [
                                            <Route8 />
                                          ] : [
                                            this.state.current == 9 ?
                                              [
                                                <Route9 />
                                              ] : [
                                                this.state.current == 10 ?
                                                  [
                                                    <Route10 />
                                                  ] : [
                                                    this.state.current == 11 ?
                                                      [
                                                        <Route11 />
                                                      ] : [
                                                        this.state.current == 12 ?
                                                        [
                                                          <Route12 />
                                                        ] : [
  
                                                        ]
                                                      ]
                                                  ]
                                              ]
                                          ]
                                      ]
                                  ]
                              ]
                          ]
                      ]

                  ]
              ]
          ] : [
              <View />
            ]
        }
      </SafeAreaView>
    );
  }
}
