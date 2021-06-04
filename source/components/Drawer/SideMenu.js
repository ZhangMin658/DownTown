import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { NavigationActions } from 'react-navigation';
import { width, height, totalSize } from 'react-native-dimension';
import { Avatar } from 'react-native-elements';
import LottieView from 'lottie-react-native';
import Form from 'react-native-vector-icons/AntDesign'
// import AsyncStorage from '../../AsyncStorage/AsyncStorage';
import Modal from "react-native-modal";
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Drawer/SideMenuStyleSheet';
import LocalDB from '../../LocalDB/LocalDB';
import Toast from 'react-native-simple-toast';
import { GoogleSignin } from '@react-native-community/google-signin';
import { widthPercentageToDP as wp } from '../../helpers/Responsive'
import { ScrollView, Text, View, Image, TouchableOpacity, BackHandler, AsyncStorage } from 'react-native';
@observer class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: false,
      isAlert: false
    }
    
  }
  static navigationOptions = { header: null };
  componentWillMount = async () => {
    var userDetail = await LocalDB.getUserProfile();
    if (userDetail !== null) {
      store.login.loginResponse.data = userDetail;
      store.login.loginStatus = true;
    } else {
      store.login.loginStatus = false;
    }
  }
  navigateToScreen = (route, title) => () => {
    // console.log(this.props.navigation)
    this.props.navigation.toggleDrawer()

    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.setParams({ otherParam: title });
    this.props.navigation.dispatch(navigateAction);
  }
  asyncDelUserInfo = async () => {
    let { orderStore } = Store;
    if (orderStore.LOGIN_TYPE === 'facebook') {
      await this.handleLogout()
    } else {
      if (orderStore.LOGIN_TYPE === 'google') {
        await this.signOutGoogle();
      }
    }
    try {
      const email = await AsyncStorage.removeItem('email');
      const password = await AsyncStorage.removeItem('password');
      const data = await AsyncStorage.removeItem('profile');
      orderStore.login.loginStatus = false;
      this.props.navigation.replace('MainScreen')
    } catch (error) {
      // Error saving data
    }
    // BackHandler.exitApp();
  }
  handleLogout = async () => {
    // var _this = this;
    // FBLoginManager.logout(function(error, data){
    //   if (!error) {
    //     _this.props.onLogout && _this.props.onLogout();
    //   } else {
    //     console.log(error, data);
    //   }
    // });
  }
  signOutGoogle = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
    } catch (error) {
      console.error(error);
    }
  };
  render() {

    let { orderStore } = Store;
    let data = orderStore.settings.data;
    let login = orderStore.login;
    return (
      <View style={[styles.container, { backgroundColor: data.sidebar_clr }]}>
        <ScrollView>
          {
            login.loginStatus ?
              <View style={styles.headerCon}>
                <View style={styles.profileImgCon}>
                  <Avatar
                    size="large"
                    rounded
                    source={{ uri: login.loginStatus === true ? login.loginResponse.data.profile_img : data.user_defualt_img }}
                    // onPress={() => console.warn("Works!")}
                    activeOpacity={0.7}
                  />
                </View>
                {login.loginStatus === true ? <Text style={styles.userName}>{login.loginResponse.data.display_name}</Text> : null}
                {login.loginStatus === true ? <Text style={styles.userEmail}>{login.loginResponse.data.user_email}</Text> : null}
              </View>
              :
              null
          }
          <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('Home', data.menu.home)}>
            <View style={styles.itemIconCon}>
              <Form name='home' size={22} color='white' />
            </View>
            <View style={styles.itemTxtCon}>
              <Text style={styles.itemTxt}>{data.menu.home}</Text>
            </View>
          </TouchableOpacity>
          {
            login.loginStatus === true ?
              null
              :
              data.menu_options.sb_listing_menu_opt ?
                <TouchableOpacity style={styles.drawerItem} onPress={() => this.setState({ isAlert: true })}>
                  <View style={styles.itemIconCon}>
                    <Form name='form' size={22} color='white' />
                  </View>
                  <View style={styles.itemTxtCon}>
                    <Text style={styles.itemTxt}>{data.menu.create_listing}</Text>
                  </View>
                </TouchableOpacity> : null
          }
          {
            login.loginStatus === true ?
              <View>
                <TouchableOpacity style={styles.drawerItem} onPress={() => {
                  // this.navigateToScreen('UserDashboard',data.menu.dashboard)
                  this.setState({ isCollapsed: !this.state.isCollapsed })
                }}>
                  <View style={styles.itemIconCon}>
                    <Form name='plussquareo' size={22} color='white' />
                  </View>
                  <View style={styles.itemTxtCon}>
                    <Text style={styles.itemTxt}>{data.menu.profile}</Text>
                  </View>
                  <View style={styles.itemIconCon}>
                    <Image source={this.state.isCollapsed === false ? require('../../images/next_White.png') : require('../../images/down-ar-white.png')} style={[styles.itemIcon, { height: height(2) }]} />
                  </View>
                </TouchableOpacity>
                {this.state.isCollapsed === true ?
                  <View style={{ width: width(65), alignItems: 'flex-start', justifyContent: 'center', alignSelf: 'flex-end' }}>
                    {
                      data.menu_options.sb_listing_menu_opt ?
                        <TouchableOpacity style={styles.drawerItem} onPress={
                          data.package.has_package ?
                            this.navigateToScreen('ListingPostTabCon', data.menu.create_listing)
                            :
                            () => {
                              this.setState({ isAlert: true })
                            }
                        }>
                          <View style={[styles.itemIconCon, { width: width(10), alignItems: 'flex-start', alignSelf: 'flex-start' }]} >
                            <Form name='form' size={22} color='white' />
                          </View>
                          <View style={styles.itemTxtCon}>
                            <Text style={styles.itemTxt}>{data.menu.create_listing}</Text>
                          </View>
                        </TouchableOpacity> : null}
                  { 
            data.menu_options.sb_prof_dashboard_menu_opt ?

                   <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('Dashboard', data.menu.dashboard)}>
                      <View style={[styles.itemIconCon, { width: width(10), alignItems: 'flex-start', alignSelf: 'flex-start' }]} >
                        <Form name='setting' size={22} color='white' />
                      </View>
                      <View style={styles.itemTxtCon}>
                        <Text style={styles.itemTxt}>{data.menu.dashboard}</Text>
                      </View>
                    </TouchableOpacity>:null}
                 { 
            data.menu_options.sb_prof_review_menu_opt ?
                 
                 <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('ReviewsCon', data.menu.reviews)}>
                      <View style={[styles.itemIconCon, { width: width(10), alignItems: 'flex-start', alignSelf: 'flex-start' }]} >
                        <Form name='staro' size={22} color='white' />
                      </View>
                      <View style={styles.itemTxtCon}>
                        <Text style={styles.itemTxt}>{data.menu.reviews}</Text>
                      </View>
                    </TouchableOpacity>:null}
                 { 
            data.menu_options.sb_prof_event_menu_opt ?
                 
                 <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('EventsTabs', data.menu.my_events)}>
                      <View style={[styles.itemIconCon, { width: width(10), alignItems: 'flex-start', alignSelf: 'flex-start' }]} >
                        <Form name='calendar' size={22} color='white' />
                      </View>
                      <View style={styles.itemTxtCon}>
                        <Text style={styles.itemTxt}>{data.menu.my_events}</Text>
                      </View>
                    </TouchableOpacity>:null
                    
                    }
                 {   
            data.menu_options.sb_prof_save_list_menu_opt ?
                 
                 <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('SavedListing', data.menu.saved_listings)}>
                      <View style={[styles.itemIconCon, { width: width(10), alignItems: 'flex-start', alignSelf: 'flex-start' }]}>
                        <Form name='hearto' size={22} color='white' />
                      </View>
                      <View style={styles.itemTxtCon}>
                        <Text style={styles.itemTxt}>{data.menu.saved_listings}</Text>
                      </View>
                    </TouchableOpacity>:null}
                  </View>
                  : null}
              </View>
              : null
          }
          <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('SelectCity', 'Select City')}>
            <View style={styles.itemIconCon}>
              <Form name='enviromento' size={22} color='white' />
            </View>
            <View style={styles.itemTxtCon}>
              <Text style={styles.itemTxt}>Select City</Text>
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('AdvanceSearch', data.menu.adv_search)}>
            <View style={styles.itemIconCon}>
              <Form name='search1' size={22} color='white' />
            </View>
            <View style={styles.itemTxtCon}>
              <Text style={styles.itemTxt}>{data.menu.adv_search}</Text>
            </View>
          </TouchableOpacity>
          {
            data.menu_options.sb_event_menu_opt ?
              <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('PublicEvents', data.menu.events)}>
                <View style={styles.itemIconCon}>
                  <Form name='calendar' size={22} color='white' />
                </View>
                <View style={styles.itemTxtCon}>
                  <Text style={styles.itemTxt}>{data.menu.events}</Text>
                </View>
              </TouchableOpacity> : null}
          {
            data.menu_options.sb_blog_menu_opt ?
              <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('blogStack', data.menu.blog)}>
                <View style={styles.itemIconCon}>
                  <Form name='profile' size={22} color='white' />
                </View>
                <View style={styles.itemTxtCon}>
                  <Text style={styles.itemTxt}>{data.menu.blog}</Text>
                </View>
              </TouchableOpacity> : null
          }

          {
            data.menu_options.sb_categories_menu_opt ?
              <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('Categories', data.menu.cats)}>
                <View style={styles.itemIconCon}>
                  <Form name='windowso' size={22} color='white' />
                </View>
                <View style={styles.itemTxtCon}>
                  <Text style={styles.itemTxt}>{data.menu.cats}</Text>
                </View>
              </TouchableOpacity> : null
          }
          {
            data.menu_options.sb_packages_menu_opt ?
              <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('Packages', data.menu.packages)}>
                <View style={styles.itemIconCon}>
                  <Form name='rocket1' size={22} color='white' />
                </View>
                <View style={styles.itemTxtCon}>
                  <Text style={styles.itemTxt}>{data.menu.packages}</Text>
                </View>
              </TouchableOpacity> : null
          }

          {
            data.menu_options.sb_language_menu_opt != undefined ?
              data.menu_options.sb_language_menu_opt ?
                [
                  <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('Language', data.menu.dwt_app_selct_language)}>
                    <View style={styles.itemIconCon}>
                      <Image source={require('../../images/language.png')} resizeMode="contain" style={{ height: wp('5') }} />
                    </View>
                    <View style={styles.itemTxtCon}>
                      <Text style={styles.itemTxt}>{data.menu.dwt_app_selct_language}</Text>
                    </View>
                  </TouchableOpacity>
                ] : [] : null
          }
          {
            data.menu_options.sb_about_us_menu_opt ? [
              <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('AboutUs', data.menu.about)}>
                <View style={styles.itemIconCon}>
                  <Image source={require('../../images/aboutus_white.png')} resizeMode="contain" style={{ height: wp('5') }} />
                </View>
                <View style={styles.itemTxtCon}>
                  <Text style={styles.itemTxt}>{data.menu.about}</Text>
                </View>
              </TouchableOpacity>
            ] : []
          }
          {
            data.menu_options.sb_contact_us_menu_opt ? [
              <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('ContactUs', data.menu.contact)}>
                <View style={styles.itemIconCon}>
                  <Image source={require('../../images/contactus_white.png')} resizeMode="contain" style={{ height: wp('5') }} />
                </View>
                <View style={styles.itemTxtCon}>
                  <Text style={styles.itemTxt}>{data.menu.contact}</Text>
                </View>
              </TouchableOpacity>
            ] : []
          }
          {
            data.menu_options.sb_loging_register_menu_opt != undefined && data.menu_options.sb_loging_register_menu_opt ?
              login.loginStatus === false ?
                <View>
                  <TouchableOpacity style={styles.drawerItem} onPress={() => this.props.navigation.replace('MainScreen')}>
                    <View style={styles.itemIconCon}>
                      <Form name='lock' size={22} color='white' />
                    </View>
                    <View style={styles.itemTxtCon}>
                      <Text style={styles.itemTxt}>{data.menu.register}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                :
                <TouchableOpacity style={styles.drawerItem} onPress={() => this.asyncDelUserInfo()}>
                  <View style={styles.itemIconCon}>
                    <Image source={require('../../images/logout.png')} style={{ height: height(2.3), width: width(10), alignSelf: 'center', resizeMode: 'contain' }} />
                  </View>
                  <View style={styles.itemTxtCon}>
                    <Text style={styles.itemTxt}>{data.menu.logout}</Text>
                  </View>
                </TouchableOpacity>
              : null
          }
          {/* <TouchableOpacity style={styles.drawerItem} onPress={this.navigateToScreen('Themes', data.menu.cats)}>
            <View style={styles.itemIconCon}>
              <Form name='windowso' size={22} color='white' />
            </View>
            <View style={styles.itemTxtCon}>
              <Text style={styles.itemTxt}>{'Themes'}</Text>
            </View>
          </TouchableOpacity> */}
        </ScrollView>
        <Modal
          animationInTiming={500}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.isAlert}
          onBackdropPress={() => this.setState({ isAlert: false })}
          style={{ flex: 1 }}>
          <View style={{ height: height(35), width: width(90), alignItems: 'center', borderRadius: 5, borderColor: 'red', borderWidth: 0.5, alignSelf: 'center', backgroundColor: 'white' }}>
            <View style={{ height: height(25), width: width(90), justifyContent: 'center', alignItems: 'center' }}>
              <LottieView source={require('../../animations/1174-warning.json')} autoPlay loop />
            </View>
            <Text style={{ marginHorizontal: 20, marginVertical: 10, color: 'black' }}>{data.package.message}</Text>
          </View>
        </Modal>
      </View>
    );
  }
}

SideMenu.propTypes = {
  navigation: PropTypes.object
};

export default SideMenu;
