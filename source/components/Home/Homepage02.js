// Banner	ca-app-pub-3940256099942544/6300978111
// Interstitial	ca-app-pub-3940256099942544/1033173712
// Interstitial Video	ca-app-pub-3940256099942544/8691691433
// Rewarded Video	ca-app-pub-3940256099942544/5224354917
// Native Advanced	ca-app-pub-3940256099942544/2247696110
// Native Advanced Video	ca-app-pub-3940256099942544/1044960115

import React, { Component } from 'react';
import {
  Platform, SafeAreaView, Text, View, ImageBackground, Image, TouchableOpacity, ScrollView, TextInput, FlatList, ActivityIndicator, RefreshControl, I18nManager
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
import styles from '../../../styles/Home2';
import ApiController from '../../ApiController/ApiController';
import ListingComponent from './ListingComponent2';
import EventComponent from './EventComponent';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../helpers/Responsive'
import ListingComponentBox from './ListingComponentBox2';
@observer export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }
  static navigationOptions = { header: null };
  navigateToScreen = (route, title) => {
    console.log("going going", title)
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
            {
              home.categories_enabled && home.categories.length != 0 ?
                <View style={styles.topViewCon} />
                : null
            }

            {
              home.categories_enabled && home.categories.length != 0 ?
                <View style={{ flex: 1, width: width(100), backgroundColor: 'transparent', alignItems: 'center', position: 'absolute', marginVertical: 1 }}>
                  <View style={styles.flatlistCon}>
                    <FlatList
                      data={home.categories}
                      renderItem={({ item, key }) =>


                        <TouchableOpacity key={key} style={styles.flatlistChild}
                          onPress={() => {
                            console.log('here category', item)
                            store.CATEGORY = item,
                            store.SEARCH_OBJ = {};

                              store.moveToSearch = true,
                              store.moveToSearchTXT=false,
                              store.moveToSearchLoc=false
                              this.navigateToScreen('SearchingScreen', data.menu.adv_search)
                          }}
                        >
                          <Animatable.View
                            duration={2000}
                            animation="zoomIn"
                            iterationCount={1}
                            direction="alternate">
                            <Image style={{ height: height(5), width: width(10), resizeMode: 'contain' }} source={{ uri: item.img }} />
                          </Animatable.View>

                          <Text style={[styles.childTxt, { fontWeight: '500', width: wp('18') }]}>{item.name}</Text>
                          <Text style={[styles.childTxt2, { width: wp('18') }]}>01 Listings</Text>


                        </TouchableOpacity>



                      }
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    // keyExtractor={item => item.email}
                    />
                  </View>
                  {/* <View style={{ flex: 1.3, width: width(100) }}></View> */}
                </View>
                :
                null
            }
            {/* /////////// */}
            {
              home.featured_enabled && home.featured_listings.has_featured_listings ?
                <View style={{ width: width(100), alignItems: 'center', justifyContent: 'center', backgroundColor: '#232323' }}>
                  <View style={{ marginHorizontal: 20, width: width(90), flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                    <Text style={{ marginVertical: 20, fontSize: 20, color: COLOR_PRIMARY, fontWeight: 'bold' }}>{home.featured_list_txt}</Text>
                    {
                      home.sb_wpml_see_all_title != undefined ?
                        <Text style={{ marginVertical: 20, fontSize: 10, color: COLOR_PRIMARY, fontWeight: 'bold', position: 'absolute', right: 0 }}>{home.sb_wpml_see_all_title}</Text>

                        : null
                    }

                  </View>


                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginHorizontal: 20 }}>
                    {
                      home.featured_listings.list.map((item, key) => {
                        return (
                          <TouchableOpacity style={{ width: width(55), backgroundColor: 'white', borderRadius: 5, marginRight: 10, marginBottom: 30 }} onPress={() => { store.LIST_ID = item.listing_id, this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
                            <Image indicator={null} source={{ uri: item.image }} style={{ height: 220, width: width(55), borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }} />

                            {
                              I18nManager.isRTL ? [
                                <Image
                                  source={require('../../images/left-star.png')}
                                  style={{ height: wp('8'), width: wp('8'), position: 'absolute', right: 0 }}
                                />
                              ] : [
                                  <Image
                                    source={require('../../images/right_Star.png')}
                                    style={{ height: wp('8'), width: wp('8'), position: 'absolute', right: 0 }}
                                  />
                                ]
                            }
                            {/* <View style={{ height: height(5), width: width(55), position: 'absolute', }}>
                              <View style={{ position: 'absolute', right: 0 }}>
                                <View style={styles.triangleCorner}></View>
                                <Icon
                                  size={13}
                                  name='star'
                                  type='entypo'
                                  color='white'
                                  containerStyle={{ marginRight: 0, marginLeft: 3, marginTop: 2, right: 1, position: 'absolute', resizeMode: 'contain' }}
                                /> */}
                            {/* <Image source={require('../../images/starfill.png')} style={{ height: height(1.5), width: width(3), marginLeft: 4, marginTop: 4, position: 'absolute', resizeMode: 'contain' }} /> */}
                            {/* </View>
                            </View> */}
                            <View style={{ backgroundColor: '#fff', borderRadius: 5, width: '97%', alignSelf: 'center', position: 'absolute', bottom: 3 }}>
                              <Text style={{ fontSize: 11, color: 'gray', marginHorizontal: 7, marginTop: 10, width: width(45) }}>{item.category_name}</Text>
                              <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLOR_SECONDARY, marginHorizontal: 7, marginTop: 3, marginBottom: 5 }}>{item.listing_title}</Text>
                              {
                                item.listing_location!=""?
                                <View style={{ marginBottom: 8, width: width(45), marginHorizontal: 5, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon
                                  size={18}
                                  name='location'
                                  type='evilicon'
                                  color='red'
                                  containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                                />
                                <Text style={{ fontSize: 10, color: '#8a8a8a' }}>{item.listing_location}</Text>
                              </View>:null}
                            </View>

                            {/* <View style={{ height: height(4), width: width(55), borderTopColor: '#cccccc', flexDirection: 'row', borderTopWidth: 0.3 }}>
                              <View style={{ width: width(27.5), justifyContent: 'center' }}>
                                <Text style={{ fontSize: totalSize(1.2), color: item.color_code, fontWeight: 'bold', marginHorizontal: 7 }}>{item.business_hours_status}</Text>
                              </View>
                              <View style={{ width: width(27.5), justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Icon
                                  size={20}
                                  name='heart'
                                  type='evilicon'
                                  color='red'
                                  containerStyle={{ marginHorizontal: 10 }}
                                  onPress={() => console.warn('Love')}
                                />
                              </View>
                            </View> */}
                          </TouchableOpacity>
                        )
                      })
                    }
                  </ScrollView>
                </View>
                :
                null
            }
            {/* //////////  */}

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
                    numColumns={2}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item, key }) =>
                      <ListingComponentBox item={item} key={key} listStatus={false} />
                    }
                    horizontal={false}
                    showsHorizontalScrollIndicator={false}
                  // keyExtractor={item => item.email}
                  />
                </View>
                :
                null
            }

            {/*
              home.location_enabled ?
                <View style={{ marginHorizontal: 15 }}>
                  <Text style={{ fontSize: 15, color: COLOR_SECONDARY, marginVertical: 15 }}>Locations</Text>
                  {
                    home.location_list.map((item, key) => {
                      return (
                        <TouchableOpacity style={{ height: height(11), width: width(90), marginRight: 5, borderRadius: 0, flexDirection: 'row', elevation: 2, shadowOpacity: 0.2, alignSelf: 'center', backgroundColor: '#fff', marginVertical: 5, alignItems: 'center' }}>
                          <Avatar
                            size="medium"
                            rounded
                            source={{ uri: item.location_image }}
                            containerStyle={{ alignSelf: 'center', resizeMode: 'contain', marginHorizontal: 10, elevation: 2, shadowOpacity: 0.2 }}
                            // onPress={() => this.props.navigation.push('PublicProfileTab', { profiler_id: item.user_id, user_name: item.user_name })}
                            activeOpacity={1}
                          />
                          <View style={{ height: height(10), width: width(53), marginHorizontal: 5, justifyContent: 'center', alignItems: 'flex-start' }}>
                            <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{item.location_name}</Text>
                            <Text style={{ fontSize: totalSize(1.7), color: COLOR_SECONDARY, marginTop: 4 }}>{item.location_ads}</Text>
                          </View>
                          <Icon size={27} color='black' name='chevrons-right' type='feather' containerStyle={{ marginHorizontal: 10 }} />
                        </TouchableOpacity>
                      )
                    })
                  }
                </View>
                :
                null
                */}
            {
              home.location_enabled && home.location_list.length!=0 ?
                <View style={{ marginHorizontal: 20 }}>

                  <View style={{ width: width(90), flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                    {
                      home.sb_wpml_best_location_title != undefined ? [
                        <Text style={{ fontSize: 20, fontWeight: 'bold', color: COLOR_SECONDARY, marginVertical: 15 }}>{home.sb_wpml_best_location_title}</Text>

                      ] : []
                    }

                    {
                      home.sb_wpml_see_all_title != undefined ?
                        <Text style={{ marginVertical: 20, fontSize: 10, color: 'red', fontWeight: 'bold', position: 'absolute', right: 0 }}>{home.sb_wpml_see_all_title}</Text>

                        : null
                    }

                  </View>

                  <View style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>

                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                      style={{ marginHorizontal: 0 }}>
                      {
                        home.location_list.map((item, key) => {
                          return (
                            <TouchableOpacity style={{ height: height(16), width: width(43), marginRight: width(3), marginVertical: 5, alignItems: 'center' }}
                              onPress={() => {
                                store.LOCATION = item,
                            store.SEARCH_OBJ = {};

                                  store.moveToSearchLoc = true,
                                  store.moveToSearch = false,
                                  store.moveToSearchTXT=false
                                 
                                  this.navigateToScreen('SearchingScreen', data.menu.adv_search)
                              }}>
                              {/* <View style={{ height: 10 }} /> */}
                              <View style={{ height: wp('28'), width: width(43.5), backgroundColor: '#fff', borderRadius: wp(3), }}>
                                <View style={{ height: wp('18'), width: '100%' }}>
                                  <Image
                                    source={{ uri: item.location_image }}
                                    style={{ height: '100%', width: '100%' }}
                                    resizeMode="cover"
                                  />
                                </View>

                                {/* <Avatar
                                  size="medium"
                                  
                                  source={{ uri: item.location_image }}
                                  containerStyle={{ resizeMode: 'contain', elevation: 2, shadowOpacity: 0.2 }}
                                  // onPress={() => this.props.navigation.push('PublicProfileTab', { profiler_id: item.user_id, user_name: item.user_name })} 
                                  activeOpacity={1}
                                /> */}
                                <View style={{ flexDirection: "row" }}>
                                  <Text style={{ fontSize: wp(2.5), fontWeight: 'bold', marginLeft: 5, color: COLOR_SECONDARY, marginTop: 8 }}>{item.location_name}</Text>
                                  {
                                    I18nManager.isRTL ? [
                                      <Image
                                        source={require('../../images/left-arrow.png')}
                                        resizeMode="contain"
                                        style={{ height: 10, width: 10, position: 'absolute', right: 10, top: 12 }}
                                      />
                                    ] : [
                                        <Image
                                          source={require('../../images/right-arrow.png')}
                                          resizeMode="contain"
                                          style={{ height: 10, width: 10, position: 'absolute', right: 10, top: 12 }}
                                        />
                                      ]
                                  }

                                </View>
                                {/* <Text style={{ fontSize: totalSize(1.7), color: COLOR_SECONDARY, marginTop: 4 }}>{'View All'}</Text> */}
                                {/* <Text style={{ fontSize: totalSize(1.7), color: COLOR_SECONDARY, marginTop: 4 }}>{item.location_ads}</Text> */}
                              </View>

                            </TouchableOpacity>
                          )
                        })
                      }
                    </ScrollView>


                    {/* {
                      home.location_list.map((item, key) => {
                        return (
                          <TouchableOpacity style={{ height: height(16), width: width(43), marginRight: this.isOdd(key) ? width(3) : 0, marginVertical: 5, alignItems: 'center' }}
                            onPress={() => {
                              store.LOCATION = item,
                                store.moveToSearchLoc = true,
                                this.navigateToScreen('SearchingScreen', data.menu.adv_search)
                            }}> */}
                    {/* <View style={{ height: 30 }} />
                            <View style={{ height: height(12), width: width(43.5), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, shadowOpacity: 0.2, elevation: 2 }}>
                              <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY, marginTop: 8 }}>{item.location_name}</Text>
                              <Text style={{ fontSize: totalSize(1.7), color: COLOR_SECONDARY, marginTop: 4 }}>{'View All'}</Text> */}
                    {/* <Text style={{ fontSize: totalSize(1.7), color: COLOR_SECONDARY, marginTop: 4 }}>{item.location_ads}</Text> */}
                    {/* </View>
                            <View style={{ height: height(10), width: width(22), position: 'absolute' }}> */}
                    {/* <Avatar
                                size="medium"
                                rounded
                                source={{ uri: item.location_image }}
                                containerStyle={{ alignSelf: 'center', resizeMode: 'contain', marginHorizontal: 10, elevation: 2, shadowOpacity: 0.2 }} */}
                    {/* // onPress={() => this.props.navigation.push('PublicProfileTab', { profiler_id: item.user_id, user_name: item.user_name })} */}
                    {/* activeOpacity={1} */}
                    {/* /> */}
                    {/* </View> */}
                    {/* </TouchableOpacity>
                        )
                      })
                    } */}
                  </View>
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
                        <Text style={[styles.latestFeature, { fontSize: 10, fontWeight: 'bold', color: 'red' }]}>{home.sb_wpml_see_all_title}</Text>
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