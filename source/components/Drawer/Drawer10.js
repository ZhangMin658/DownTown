import React from 'react';
import { Platform, I18nManager } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { FONT_NORMAL, COLOR_PRIMARY, COLOR_ORANGE, COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { createStackNavigator, createDrawerNavigator, createAppContainer } from 'react-navigation';
import Home from '../Home/Homepage10';
import FeatureDetailTabBar from '../FeatureDetail/FeatureDetailTabBar';
import UserDashboard from '../UserDashboard/UserDashboard';
import SideMenu from './SideMenu';
import EditProfile from '../UserDashboard/EditProfile'
import ListingTabCon from '../Listing/ListingTabCon';
import ContactUs from '../ContactUs/ContactUs';
import AboutUs from '../AboutUs/AboutUs';
import blogStack from '../Blogs/Blogs';
import PublicEvents from '../PublicEvents/PublicEvents';
import PublicEventsW from '../PublicEvents/PublicEventsW';
import Packages from '../Packages/Packages';
import ReviewsCon from '../Reviews/ReviewsCon';
import SavedListing from '../SavedListing/SavedListing';
import EventsTabs from '../Events/EventsTabs';
import SearchingScreen from '../AdvanceSearch/SearchingScreen';
import SearchingScreenW from '../AdvanceSearch/SearchingScreenWBar';
import Categories from '../Categories/Categories';
import ListingPostTabCon from '../PostListings/ListingPostTabCon';
import Themes from '../Themes/Themes';
import Language from '../Languages/Language';


const DashboardStack = createStackNavigator({
  UserDashboard: UserDashboard,
  EditProfile: EditProfile,

});
const DrawerComp = createDrawerNavigator({
  Home: Home,
  FeatureDetailTabBar: FeatureDetailTabBar,
  ListingPostTabCon: ListingPostTabCon,
  Dashboard: DashboardStack,
  ListingTabCon: ListingTabCon,
  AboutUs: AboutUs,
  ContactUs: ContactUs,
  blogStack: blogStack,
  Packages: Packages,
  ReviewsCon: ReviewsCon,
  SavedListing: SavedListing,
  EventsTabs: EventsTabs,
  SearchingScreen: SearchingScreenW,
  PublicEvents: PublicEventsW,
  Categories: Categories,
  Themes: Themes,
  Language: Language,


},
  {
    order: [ 'Packages','Language', 'EventsTabs','ReviewsCon', 'ListingPostTabCon','SearchingScreen', 'Home', 'ListingTabCon', 'Dashboard', 'AboutUs', 'ContactUs', 'blogStack', 'SavedListing', 'Categories','Themes','PublicEvents'],
    initialRouteName: 'Home',
    drawerWidth: width(80), 
    drawerPosition: I18nManager.isRTL ? 'right' : 'left',
    mode: Platform.OS === 'ios' ? 'modal' : 'card',
    contentComponent: props => <SideMenu {...props} />,
    useNativeAnimations: true,
    drawerBackgroundColor: COLOR_TRANSPARENT_BLACK,
    contentOptions: {
      activeTintColor: COLOR_PRIMARY,
      activeBackgroundColor: COLOR_ORANGE,
      inactiveTintColor: COLOR_PRIMARY,
      itemsContainerStyle: {
        justifyContent: 'center',
      },
      itemStyle: {
        // ImageBackground:'red'
      },
      labelStyle: {
        fontFamily: FONT_NORMAL,
        fontSize: totalSize(1.6)
      },
      activeLabelStyle: {
        fontFamily: 'bold',
        fontSize: totalSize(1.9)
      },
      inactiveLabelStyle: {
        fontFamily: FONT_NORMAL,
        fontSize: totalSize(1.6)
      },
      iconContainerStyle: {
        opacity: 1,
        // backgroundColor:'red'
      }
    }
  }
);
export default DrawerComp;
