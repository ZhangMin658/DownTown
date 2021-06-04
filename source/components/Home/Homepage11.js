// Banner	ca-app-pub-3940256099942544/6300978111
// Interstitial	ca-app-pub-3940256099942544/1033173712
// Interstitial Video	ca-app-pub-3940256099942544/8691691433
// Rewarded Video	ca-app-pub-3940256099942544/5224354917
// Native Advanced	ca-app-pub-3940256099942544/2247696110
// Native Advanced Video	ca-app-pub-3940256099942544/1044960115

import React, { Component } from 'react';
import {
  Platform, SafeAreaView, Text, View,I18nManager, ImageBackground, Image, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, RefreshControl
} from 'react-native';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';
// import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import ProgressImage from '../CustomTags/ImageTag';
import { Icon, Avatar } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import { NavigationActions } from 'react-navigation';
import { observer } from 'mobx-react';
import StarRating from 'react-native-star-rating';
import Marker from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Home11';
import ApiController from '../../ApiController/ApiController';
import ListingComponent from './ListingComponent11';
import EventComponent from './EventComponent';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../helpers/Responsive'

@observer export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }
  static navigationOptions = { header: null };
  navigateToScreen = (route, title) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.setParams({ otherParam: title });
    this.props.navigation.dispatch(navigateAction);
  }
  componentWillMount = async () => {
    // calling homeData func

    


    store.SEARCH_OBJ = {};
    this.setState({ loading: true })
    let response = await ApiController.post('listing-filters');
    // console.log('Listing Filter response====>>>>', response);
    if (response.success) {
      store.SEARCHING.LISTING_FILTER = response;
      // creating new array named as options
      store.SEARCHING.LISTING_FILTER.data.all_filters.forEach(item => {
        if (item.type === 'dropdown') {
          item.options = [];
          item.option_dropdown.forEach(val => {
            item.options.push({ value: val.value })
          });
        }
      });
      // Adding states to buttons....
      store.SEARCHING.LISTING_FILTER.data.status.checkStatus = false;
      if (store.SEARCHING.LISTING_FILTER.data.is_rated_enabled) {
        store.SEARCHING.LISTING_FILTER.data.rated.option_dropdown.forEach(item => {
          item.checkStatus = false;
        });
      }
      // adding states to checkBoxes
      store.SEARCHING.LISTING_FILTER.data.sorting.option_dropdown.forEach(item => {
        item.checkStatus = false;
      });
      // sorting object for events sorting
      store.EVENTS_SORTING = store.SEARCHING.LISTING_FILTER.data.sorting;
      await this.homeData()
      this.setState({ loading: false })
    } else {
      this.setState({ loading: false })
    }
  }
  componentDidMount = async () => {
    await this.interstitial()
  }
  interstitial = () => {
    let data = store.settings.data;
    try {
      if (data.has_admob && data.admob.interstitial !== '') {
        AdMobInterstitial.setAdUnitID(data.admob.interstitial); //ca-app-pub-3940256099942544/1033173712
        AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd());
      }
      // InterstitialAdManager.showAd('636005723573957_636012803573249')
      //   .then(didClick => console.log('response===>>>',didClick))
      //   .catch(error => console.log('error===>>>',error)); 
    } catch (error) {
      console.log('catch===>>>', error);
    }
  }
  // Getting home data func 
  homeData = async () => {
    try {
      this.setState({ loading: true })
      //API calling
      let response = await ApiController.post('home');
      console.log('responseHome==>>>>>', response);
      if (response.success) {
        store.home.homeGet = response;
        this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      this.setState({ loading: false })
      console.log('error', error);
    }
  }
  isOdd(value) {
    if (value % 2 == 0)
      return true;
    else
      return false;
  }
  render() {
    let data = store.settings.data;
    let home = store.home.homeGet.data;
    if (this.state.loading == true) {
      return (
        <View style={styles.IndicatorCon}>
          <ActivityIndicator color={store.settings.data.navbar_clr} size='large' animating={true} />
        </View>
      );
    }
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.subCon}>
          {
            data.has_admob && data.admob.banner !== '' ?
              <AdMobBanner
                adSize={Platform.OS === 'ios' ? "smartBanner" : "smartBannerLandscape"}
                adUnitID={data.admob.banner} // 'ca-app-pub-3940256099942544/6300978111' 
                onAdFailedToLoad={async () => await this.setState({ loadAdd: false })}
                didFailToReceiveAdWithError={async () => await this.setState({ loadAdd: false })}
                onAdLoaded={async () => { await this.setState({ loadAdd: true }) }}
              />
              :
              null
          }
          {/* <BannerView
            placementId="636005723573957_636012803573249"
            type="standard"
            onPress={() => console.log('click')}
            onError={err => console.log('error', err)}
          /> */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                colors={['white']}
                progressBackgroundColor={store.settings.data.main_clr}
                tintColor={store.settings.data.main_clr}
                refreshing={this.state.refreshing}
                onRefresh={this.homeData}
              />
            }>

            <View style={[I18nManager.isRTL?{marginLeft:wp('5'),marginBottom: wp('5')}:{ paddingLeft: wp('5'), marginBottom: wp('5') }]}>


              {
                home.sb_wpml_find_best_place != undefined ?
                  <Text style={[{ color: '#000', fontSize: wp('6'), fontWeight: 'bold' },I18nManager.isRTL?{textAlign:'left'}:{}]}>{home.sb_wpml_find_best_place}</Text>
                  : null
              }
              {
                home.sb_wpml_more_busines_listed != undefined ?
                  <Text style={[{ color: '#000', fontSize: wp('3') },I18nManager.isRTL?{textAlign:'left'}:{}]}>{home.sb_wpml_more_busines_listed}</Text>
                  : null
              }




            </View>


            <View style={{ backgroundColor: '#fff', borderTopLeftRadius: wp('6'), borderTopRightRadius: wp('6') }}>
              { home.categories_enabled && home.categories.length!=0?
                     <View style={styles.topViewCon}>
                     {
                       home.categories_enabled ?
                         <View style={{ width: width(100), backgroundColor: 'transparent', alignItems: 'center', position: 'absolute', marginVertical: 1 }}>
     
     
                           <View style={styles.flatlistCon}>
                             <FlatList
                               numColumns={3}
                               data={home.categories}
                               renderItem={({ item, key }) =>
                                 <View style={{
                                   // marginTop: 15,
                                   marginBottom: 8,
                                   marginRight: 15,
                                   alignContent: 'center',
                                   alignItems: 'center'
                                   // marginHorizontal: 10,
                                 }}>
     
                                   <TouchableOpacity key={key} style={styles.flatlistChild}
                                     onPress={() => {
                                       store.CATEGORY = item,
                            store.SEARCH_OBJ = {};

                                         store.moveToSearch = true

                                      
                                         store.moveToSearchTXT=false,
                                         store.moveToSearchLoc=false
                                         this.navigateToScreen('SearchingScreen', data.menu.adv_search)
                                     }}
                                   >
     
     
                                     <Text style={[styles.childTxt, { fontWeight: '500', width: wp('18') }]}>{item.name}</Text>
     
                                   </TouchableOpacity>
     
     
                                 </View>
                               }
                             // horizontal={true}
                             // showsHorizontalScrollIndicator={false}
                             // keyExtractor={item => item.email}
                             />
                           </View>
                           <View style={{ flex: 1.3, width: width(100) }}></View>
                         </View>
                         :
                         null
                     }
                   </View>:null
     
              }
         
              {
                home.listings_enabled ?
                  <View style={{ width: width(90), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 15 : 15, marginBottom: 5 }}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                      <Text style={styles.recList}>{home.section_txt}</Text>
                    </View>
                    {
                      home.sb_wpml_see_all_title != undefined ?
                        <TouchableOpacity style={[styles.readMoreBtnCon]} onPress={() => this.navigateToScreen('SearchingScreen', data.menu.adv_search)}>
                          <Text style={[styles.latestFeature, { fontSize: 10, fontWeight: 'bold', marginTop: 3, color: store.settings.data.main_clr }]}>{home.sb_wpml_see_all_title}</Text>
                          {/* <Text style={[styles.latestFeature, { fontSize: 10,fontWeight:'bold', marginTop: 3, color: store.settings.data.navbar_clr }]}>{home.section_btn}</Text> */}
                        </TouchableOpacity>
                        : null
                    }

                  </View>
                  :
                  null
              }
              {
                home.listings_enabled ?
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <FlatList
                      data={home.listings}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, key }) =>
                        <ListingComponent item={item} key={key} listStatus={false} />
                      }
                      horizontal={false}
                      showsHorizontalScrollIndicator={false}
                    // keyExtractor={item => item.email}
                    />
                  </View>
                  :
                  null
              }


              {
                home.events_enabled ?
                  <View style={styles.cate_con}>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                      <Text style={styles.recList}>{home.latest_events}</Text>
                    </View>
                    {
                      home.sb_wpml_see_all_title != undefined ?
                        <TouchableOpacity style={[styles.readMoreBtnCon, { borderColor: store.settings.data.navbar_clr }]} onPress={() => this.navigateToScreen('PublicEvents', 'Home')}>
                          <Text style={[styles.latestFeature, { fontSize: 10, fontWeight: 'bold', color: store.settings.data.main_clr }]}>{home.sb_wpml_see_all_title}</Text>
                          {/* <Text style={[styles.latestFeature, { fontSize: 13 }]}>{home.view_all_events}</Text> */}
                        </TouchableOpacity>
                        : null
                    }

                  </View>
                  :
                  null
              }
              {
                home.events_enabled ?
                  <View style={[styles.flatlistCon, { position: null, height: null, marginTop: 0, marginBottom: 15 }]}>
                    <FlatList
                      data={home.events}
                      showsVerticalScrollIndicator={false}
                      renderItem={({ item, key }) => <EventComponent item={item} key={key} />}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    // keyExtractor={item => item.email}
                    />
                  </View>
                  :
                  null
              }
            </View>

          </ScrollView>
          <TouchableOpacity style={[styles.exploreBtn, { backgroundColor: data.main_clr }]} onPress={() => this.navigateToScreen('SearchingScreen', 'Advance')}>
            {/* <Image source={require('../../images/search_white.png')} style={styles.btnIcon} /> */}
            <Icon
              size={28}
              name='search'
              type='evilicon'
              color='white'
              containerStyle={{ marginLeft: 0, marginVertical: 10 }}
              // containerStyle={styles.searchIcon}
              onPress={() => this.navigateToScreen('SearchingScreen', 'search')}
            />
            <Text style={styles.explorebtnTxt}>{data.main_screen.explore}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
}