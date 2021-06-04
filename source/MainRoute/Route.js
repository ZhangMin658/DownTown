import React, { Component } from 'react';
import { Platform, StatusBar, Text, TextInput,I18nManager, View, TouchableOpacity, Image, Alert, Keyboard } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../source/helpers/Responsive'
//Authentication
import Splash from '../components/SplashScreen/Splash';
import Welcome from '../components/SplashScreen/Welcome';
import MainScreen from '../components/MainScreen/MainScreen';
import SignUp from '../components/SignUp/SignUp';
import SignIn from '../components/SignIn/SignIn';
import ForgetPassword from '../components/ForgetPassword/ForgetPassword';

import Home from '../components/Home/Home';
import FeatureDetail from '../components/FeatureDetail/FeatureDetail';
import FeatureDetailTabBar from '../components/FeatureDetail/FeatureDetailTabBar';
import Discription from '../components/FeatureDetail/Description';
import UserDashboard from '../components/UserDashboard/UserDashboard';
import Drawer from '../components/Drawer/Drawer';
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
import Language from '../components/Languages/Language';
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
import SelectCity from '../components/AdvanceSearch/SelectCity';
import { observer } from 'mobx-react';
import store from '../Stores/orderStore';
import styles from '../../styles/HeadersStyles/DrawerHeaderStyleSheet';
import { Icon, Avatar } from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign'
import { NavigationActions } from 'react-navigation';

@observer export class HeaderRoute1 extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchtxt: ''
    }
    //  this.te .xtInput=null
  }

  onSearch=() => {
    // console.log('this props',this.props)
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

    } else {
      Keyboard.dismiss()
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
      // this.setState({searchtxt:''})
    }

  }
 
  render() {
    
    return (
      <View style={[styles.overlyHeader, { backgroundColor: 'black' }]}>
        <TouchableOpacity style={[styles.drawerBtnCon ,{  transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}]} onPress={() => {
          // console.log(this.props.navigation)
          this.props.navigation.toggleDrawer()
        }}>
          <Image source={require('../images/menu_newhome.png')} style={styles.drawerBtn} />
        </TouchableOpacity>
        <View style={styles.headerTxtCon}>
          {/* <View style={{ backgroundColor: '#fff', height: '90%', width: '90%', borderRadius: 10, alignItems: 'center', alignContent: 'center' }}> */}
          <TextInput
            onChangeText={(value) => this.setState({ searchtxt: value })}
            underlineColorAndroid='transparent'
            value={this.state.searchtxt}
            // placeholder={'اختار اللغة'}
            placeholder={store.home.homeGet!=null?store.home.homeGet.data!=undefined?store.home.homeGet.data.advanced_search.search_placeholder:'':''}
            // placeholder={store.home.homeGet.data.advanced_search.search_placeholder}
            placeholderTextColor='black'
            underlineColorAndroid='transparent'

            style={[I18nManager.isRTL?{textAlign:'right'}:{},{ height: wp(10), paddingLeft: 15, paddingVertical: wp(2.5), backgroundColor: '#fff', width: '100%', borderRadius: 8, fontSize: totalSize(1.5), }]}
          />

        </View>
        <TouchableOpacity onPress= {this.onSearch}>
        <View style={{ backgroundColor: store.settings.data.main_clr, alignContent: 'center', alignItems: 'center', justifyContent: 'center', marginLeft: 5, height: wp('10'), width: wp('10'), borderRadius: wp('5') }}>
          <AntDesign
            size={22}
            name='search1'
            color='#fff'
            containerStyle={{ marginLeft: 0, marginVertical: 3 }}
            // containerStyle={styles.searchIcon}
            
          />
        </View>
        </TouchableOpacity>
        {/* <Text style={styles.headerTxt}>{navigation.getParam('otherParam', store.settings.data.menu.home)}</Text> */}
        {/* </View> */}
        <View style={{ flex: 1 }}></View>
        {/* <Image source={require('../images/search_white.png')} style={styles.headerSearch} />
            <Image source={require('../images/cart.png')} style={styles.cart} /> */}
      </View>

    )
  }
}


const RootStack = createStackNavigator(
  {
    Splash: Splash,
    Welcome : Welcome,
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
          
          <HeaderRoute1 navigation={navigation} />
        )
      }),
    },
    SelectCity : SelectCity,
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
    Language: Language,
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