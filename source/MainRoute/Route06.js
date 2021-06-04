import React, { Component } from 'react';
import { Platform, StatusBar, Text, I18nManager,TextInput, View, TouchableOpacity, Image, Alert, Keyboard } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../source/helpers/Responsive'
//Authentication
import Splash from '../components/SplashScreen/Splash';
import MainScreen from '../components/MainScreen/MainScreen';
import SignUp from '../components/SignUp/SignUp';
import SignIn from '../components/SignIn/SignIn';
import ForgetPassword from '../components/ForgetPassword/ForgetPassword';

import Home from '../components/Home/Homepage06';
import FeatureDetail from '../components/FeatureDetail/FeatureDetail';
import FeatureDetailTabBar from '../components/FeatureDetail/FeatureDetailTabBar';
import Discription from '../components/FeatureDetail/Description';
import UserDashboard from '../components/UserDashboard/UserDashboard';
import Drawer from '../components/Drawer/Drawer06';
import SideMenu from '../components/Drawer/SideMenu';
import ContactUs from '../components/ContactUs/ContactUs';
import AboutUs from '../components/AboutUs/AboutUs';
import EditProfile from '../components/UserDashboard/EditProfile'
import ListingStack from '../components/Listing/ListingStack';
import ListingPostTabCon from '../components/PostListings/ListingPostTabCon';
import blogStack from '../components/Blogs/Blogs';
import BlogDetail from '../components/Blogs/BlogDetail';
import PublicEvents from '../components/PublicEvents/PublicEvents';
import Packages from '../components/Packages/Packages';
import ReviewsCon from '../components/Reviews/ReviewsCon';
import SavedListing from '../components/SavedListing/SavedListing';
import AdvanceSearch from '../components/AdvanceSearch/AdvanceSearch';
import SearchingScreen from '../components/AdvanceSearch/SearchingScreen';
import EventsTabs from '../components/Events/EventsTabs';
import CreactEvent from '../components/Events/CreateEvent';
import Categories from '../components/Categories/Categories';
import EventDetail from '../components/Events/EventDetail'
import PublicProfileTab from '../components/PublicProfile/PublicProfileTab';
import EventSearching from '../components/PublicEvents/EventSearching';

import { observer } from 'mobx-react';
import store from '../Stores/orderStore';
import styles from '../../styles/HeadersStyles/DrawerHeaderStyleSheet6';
import { Icon, Avatar } from 'react-native-elements';
import { NavigationActions } from 'react-navigation';


@observer export class HeaderRoute6 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchtxt: ''
    }
    //  this.te .xtInput=null
  }

  render() {
    return (
      <View style={[styles.overlyHeader, { backgroundColor: '#f9f9f9', alignContent: 'center', alignItems: 'center' }]}>
        <TouchableOpacity style={[styles.drawerBtnCon ,{  transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}]} onPress={() => {
          this.props.navigation.toggleDrawer()
        }}>
          <Image source={require('../images/menu_newhome2.png')} style={styles.drawerBtn} />
        </TouchableOpacity>
        <View style={[styles.headerTxtCon, { width: wp(88) }]}>
          {/* <View style={{ backgroundColor: '#fff', height: '90%', width: '90%', borderRadius: 10, alignItems: 'center', alignContent: 'center' }}> */}
          <TextInput
            onChangeText={(value) => this.setState({ searchtxt: value })}
            underlineColorAndroid='transparent'
            placeholder={store.home.homeGet!=null?store.home.homeGet.data!=undefined?store.home.homeGet.data.advanced_search.search_placeholder:'':''}
           
            // placeholder={orderStore.home.homeGet.data.advanced_search.search_placeholder}
            // placeholderTextColor='black'
            value={this.state.searchtxt}
            underlineColorAndroid='transparent'
            autoCorrect={false}
            placeholderTextColor={"#fff"}

            style={[I18nManager.isRTL?{textAlign:'right'}:{},{ height: wp(10), paddingLeft: 15, paddingVertical: wp('2.5'), backgroundColor: '#000', color: '#fff', width: '100%', borderRadius: wp('6'), fontSize: totalSize(1.5), }]}
          />
          <Icon
            size={wp(6)}
            name='search'
            type='evilicon'
            color='#fff'
            containerStyle={{ marginLeft: 0, marginVertical: 3, position: 'absolute', right: wp('2'), alignSelf: 'center' }}
            // containerStyle={styles.searchIcon}
            onPress={() => {
            // console.log('navigaitonxxx', NavigationActions)
              // console.log('searchtext', this.state.searchtxt)
              Keyboard.dismiss()
             
              if (this.props.navigation.state.index == 14) {
                store.SEARCH_OBJ_EVENT.by_title = this.state.searchtxt
                const navigateAction = NavigationActions.navigate({
                  routeName: 'PublicEvents',
                  params: { search_text: this.state.searchtxt }
                });
                this.props.navigation.setParams({
                  params: { search_text: this.state.searchtxt },
                  key: 'screen-123',
                });
                this.props.navigation.dispatch(navigateAction);

              }else{
                store.SEARCHTEXT = this.state.searchtxt,
                  store.moveToSearchTXT = true
                // if(this.props.navigation.state.index != 4 ){
                const navigateAction = NavigationActions.navigate({
                  routeName: 'SearchingScreen',
                  params: { search_text: this.state.searchtxt }
                });
                this.props.navigation.setParams({
                  params: { search_text: this.state.searchtxt },
                  key: 'screen-123',
                });
                this.props.navigation.dispatch(navigateAction);
              }
            
            }}
          />
        </View>
      
        <View style={{ flex: 1 }}></View>
       
      </View>
              ///////////////////

    )
  }
}

const RootStack = createStackNavigator(
  {
    Splash: Splash,
    MainScreen: MainScreen,
    SignUp: SignUp,
    SignIn: SignIn,
    Home: Home,
    ForgetPassword: ForgetPassword,
    FeatureDetail: FeatureDetail,
    Discription: Discription,
    FeatureDetailTabBar: FeatureDetailTabBar,
    Drawer: {
      screen: Drawer,
      navigationOptions: ({ navigation }) => ({
        title: navigation.getParam('otherParam', store.settings.data.menu.home),
        header: (
         <HeaderRoute6 navigation={navigation}/>
        )
      }),
    },
    SideMenu: SideMenu,
    UserDashboard: UserDashboard,
    ContactUs: ContactUs,
    AboutUs: AboutUs,
    EditProfile: EditProfile,
    ListingStack: ListingStack,
    ListingPostTabCon: ListingPostTabCon,
    Blogs: blogStack,
    BlogDetail: BlogDetail,
    Packages: Packages,
    ReviewsCon: ReviewsCon,
    SavedListing: SavedListing,
    AdvanceSearch: AdvanceSearch,
    SearchingScreen: SearchingScreen,
    EventsTabs: EventsTabs,
    CreactEvent: CreactEvent,
    Categories: Categories,
    EventDetail: EventDetail,
    PublicProfileTab: PublicProfileTab,
    EventSearching: EventSearching
  },
  {
    initialRouteName: 'Splash',
    mode: Platform.OS === 'ios' ? 'pattern' : 'card',
    headerMode: Platform.OS === 'ios' ? 'float' : 'screen',
    headerTransitionPreset: Platform.OS === 'ios' ? 'uikit' : null,
    headerLayoutPreset: Platform.OS === 'ios' ? 'center' : 'left',
    headerBackTitleVisible: Platform.OS === 'ios' ? true : false,
    navigationOptions: {
      headerTitleStyle: { fontSize: totalSize(2), fontWeight: 'normal' },
      gesturesEnabled: true,
    }
  }
);
export default createAppContainer(RootStack);