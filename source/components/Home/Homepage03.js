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
import { Icon, Avatar } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import { NavigationActions } from 'react-navigation';
import { observer } from 'mobx-react';
import * as Animatable from 'react-native-animatable';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Home';
import ApiController from '../../ApiController/ApiController';
import ListingComponent from './ListingComponent';
import EventComponent from './EventComponent';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from '../../helpers/Responsive'
import Carousel from 'react-native-snap-carousel';

@observer export default class Home extends Component<Props> {
  static Cards = [
    {
      imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500',
      title: 'Java Developer',
      subtitle: 'New York City',
      buttonText: 'Apply Now'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1501850305723-0bf18f354fea?w=500',
      title: 'React Native Developer',
      subtitle: 'San Francisco',
      buttonText: 'Learn More'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1489389944381-3471b5b30f04?w=500',
      title: 'Node.js Developer',
      subtitle: 'New York City',
      buttonText: 'Apply Now'
    },
    {
      imageUrl: 'https://images.unsplash.com/photo-1505238680356-667803448bb6?w=500',
      title: 'Python Developer',
      subtitle: 'Los Angeles',
      buttonText: 'Learn More'
    },
  ];
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
            <View style={{ marginTop: wp('2') }} />
            {
              home.featured_enabled && home.featured_listings.has_featured_listings ?
                <Carousel
                  layout={'default'}
                  // loop={true}
                  ref={(c) => { this._carousel = c; }}
                  data={home.featured_listings.list}
                  renderItem={({ item, index }) =>

                    <View>
                      <Image
                        source={{ uri: item.image }}
                        style={{ height: wp('66'), width: wp('70') }}
                        resizeMode="contain"
                      />
                      <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', position: 'absolute', bottom: 0 }}>
                        <View style={{ backgroundColor: item.color_code, padding: wp('1'), paddingHorizontal: wp('2.5'), borderRadius: wp('1'), position: 'absolute', alignItems: 'center', alignContent: 'center', right: wp('2'), top: wp('3') }}>
                          <Text style={{ fontSize: wp('3'), color: '#fff', fontWeight: 'bold' }}>{item.business_hours_status}</Text>
                        </View>
                        <View style={{ bottom: 0, position: 'absolute', marginLeft: wp('4') }}>
                          <Text style={{ color: '#fff', marginBottom: 4, fontWeight: 'bold', width: wp('60'), marginLeft: wp('1'), fontSize: wp('5') }}>{item.listing_title}</Text>
                          <View style={{ marginBottom: 8, width: wp(45), flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                            <Icon
                              size={16}
                              name='location'
                              type='evilicon'
                              color='white'
                              containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                            />
                            <Text style={{ fontSize: wp('3'), color: '#fff' }}>{item.listing_location}</Text>
                          </View>
                        </View>


                      </View>

                    </View>

                  }
                  sliderWidth={wp('100')}
                  itemWidth={wp('70')}

                ></Carousel>
                // <View style={{ width: width(100), alignItems: 'center', justifyContent: 'center', backgroundColor: '#232323' }}>
                //   <View style={{ marginHorizontal: 20, width: width(90), flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                //     <Text style={{ marginVertical: 20, fontSize: 20, color: COLOR_PRIMARY, fontWeight: 'bold' }}>{home.featured_list_txt}</Text>

                //     <Text style={{ marginVertical: 20, fontSize: 10, color: COLOR_PRIMARY, fontWeight: 'bold', position: 'absolute', right: 0 }}>See All</Text>

                //   </View>


                //   <ScrollView
                //     horizontal={true}
                //     showsHorizontalScrollIndicator={false}
                //     style={{ marginHorizontal: 20 }}>
                //     {
                //       home.featured_listings.list.map((item, key) => {
                //         return (
                //           <TouchableOpacity style={{ width: width(55), backgroundColor: 'white', borderRadius: 5, marginRight: 10, marginBottom: 30 }} onPress={() => { store.LIST_ID = item.listing_id, this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
                //             <Image indicator={null} source={{ uri: item.image }} style={{ height: 220, width: width(55), borderTopLeftRadius: 5, borderTopRightRadius: 5, borderBottomLeftRadius: 5, borderBottomRightRadius: 5 }} />
                //             <View style={{ height: height(5), width: width(55), position: 'absolute', }}>
                //               <View style={{ position: 'absolute', right: 0 }}>
                //                 <View style={styles.triangleCorner}></View>
                //                 <Icon
                //                   size={13}
                //                   name='star'
                //                   type='entypo'
                //                   color='white'
                //                   containerStyle={{ marginRight: 0, marginLeft: 3, marginTop: 2, right: 1, position: 'absolute', resizeMode: 'contain' }}
                //                 />
                //                 {/* <Image source={require('../../images/starfill.png')} style={{ height: height(1.5), width: width(3), marginLeft: 4, marginTop: 4, position: 'absolute', resizeMode: 'contain' }} /> */}
                //               </View>
                //             </View>
                //             <View style={{ backgroundColor: '#fff', borderRadius: 5, width: '97%', alignSelf: 'center', position: 'absolute', bottom: 3 }}>
                //               <Text style={{ fontSize: 11, color: 'gray', marginHorizontal: 7, marginTop: 10, width: width(45) }}>{item.category_name}</Text>
                //               <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLOR_SECONDARY, marginHorizontal: 7, marginTop: 3, marginBottom: 5 }}>{item.listing_title}</Text>
                //               <View style={{ marginBottom: 8, width: width(45), marginHorizontal: 5, flexDirection: 'row', alignItems: 'center' }}>
                //                 <Icon
                //                   size={18}
                //                   name='location'
                //                   type='evilicon'
                //                   color='red'
                //                   containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                //                 />
                //                 <Text style={{ fontSize: 10, color: '#8a8a8a' }}>Arkasana, United States</Text>
                //               </View>
                //             </View>


                //           </TouchableOpacity>
                //         )
                //       })
                //     }
                //   </ScrollView>
                // </View>
                :
                null
            }
            {
              home.categories_enabled && home.categories.length != 0 ?
                <View style={[styles.topViewCon, { height: wp('25'), marginTop: wp('5') }]}>
                  {
                    home.categories_enabled ?
                      <View style={{ flex: 1, width: width(100), backgroundColor: 'transparent', alignItems: 'center', position: 'absolute', marginVertical: 1 }}>
                        <View style={styles.flatlistCon}>
                          <FlatList
                            data={home.categories}
                            renderItem={({ item, key }) =>
                              <View style={{
                                marginBottom: 8,
                                marginRight: 15,
                                alignContent: 'center',
                                alignItems: 'center'
                                // marginHorizontal: 10,
                              }}>

                                <TouchableOpacity key={key} style={[styles.flatlistChild, { backgroundColor: '#f9f9f9' }]}
                                  onPress={() => {
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
                                  {
                                    item.count != undefined ?
                                      <View style={{ height: wp(4), width: wp(4), alignContent: 'center', alignItems: 'center', justifyContent: 'center', backgroundColor: 'red', position: 'absolute', borderRadius: wp(2), top: 0, right: 0 }}>
                                        <Text style={{ color: '#fff', fontSize: width(1.6), fontWeight: 'bold' }}>{item.count}</Text>
                                      </View>
                                      : null
                                  }


                                </TouchableOpacity>

                                <Text style={[styles.childTxt, { fontWeight: '500', width: wp('18') }]}>{item.name}</Text>

                              </View>
                            }
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                          // keyExtractor={item => item.email}
                          />
                        </View>
                        <View style={{ flex: 1.3, width: width(100) }}></View>
                      </View>
                      :
                      null
                  }
                </View> : null
            }


            {
              home.listings_enabled ?
                <View style={{ backgroundColor: '#f9f9f9', width: '100%', marginTop: wp('5'), alignSelf: 'center', alignItems: 'center', borderTopLeftRadius: wp('10'), borderTopRightRadius: wp('10'), paddingBottom: wp('5') }}>
                  <View style={{ flexDirection: 'row', paddingHorizontal: wp('5'), paddingTop: wp('5'), marginBottom: wp('2') }}>
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
            {/* {
              home.listings_enabled ?
                <View style={{ flex: 1, alignItems: 'center' }}>
                 
                </View>
                :
                null
            } */}

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
              home.location_enabled && home.location_list.length != 0 ?
                <View style={{ marginHorizontal: 20 }}>

                  <View style={{ width: width(90), flexDirection: 'row', alignContent: 'center', alignItems: 'center' }}>
                    {
                      home.sb_wpml_best_location_title != undefined ? [
                        <Text style={{ fontSize: 20, fontWeight: '700', color: COLOR_SECONDARY, marginVertical: 15 }}>{home.sb_wpml_best_location_title}</Text>

                      ] : []
                    }

                    {
                      home.sb_wpml_see_all_title != undefined ?
                        <Text style={{ marginVertical: 20, fontSize: 10, color: store.settings.data.main_clr, fontWeight: 'bold', position: 'absolute', right: 0 }}>{home.sb_wpml_see_all_title}</Text>

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
                            <TouchableOpacity style={{ height: height(16), width: width(43), marginRight: width(3), marginVertical: 5, alignItems: 'center', }}
                              onPress={() => {
                                store.LOCATION = item,

                                  store.SEARCH_OBJ = {};

                                  store.moveToSearchLoc = true,

                                  store.moveToSearch = false,
                                  store.moveToSearchTXT=false
                                 
                                  this.navigateToScreen('SearchingScreen', data.menu.adv_search)
                              }}>
                              {/* <View style={{ height: 10 }} /> */}
                              <View style={{ width: width(43.5), paddingHorizontal: wp('5'), paddingVertical: wp('3'), backgroundColor: '#fff', borderRadius: wp(3), backgroundColor: "#f9f9f9" }}>
                                <Avatar
                                  size="medium"
                                  rounded
                                  source={{ uri: item.location_image }}
                                  containerStyle={{ resizeMode: 'contain', elevation: 2, shadowOpacity: 0.2 }}
                                  // onPress={() => this.props.navigation.push('PublicProfileTab', { profiler_id: item.user_id, user_name: item.user_name })} 
                                  activeOpacity={1}
                                />
                                <View style={{ flexDirection: "row" }}>
                                  <Text style={{ fontSize: totalSize(1.5), fontWeight: 'bold', marginLeft: 5, color: COLOR_SECONDARY, marginTop: 8 }}>{item.location_name}</Text>
                                  <Image
                                    source={require('../../images/right-arrow.png')}
                                    resizeMode="contain"
                                    style={[{ height: 10, width: 10, position: 'absolute', right: 10, top: 12 },I18nManager.isRTL?{transform: [{scaleX: I18nManager.isRTL ? -1 : 1}]}:{}]}
                                  />
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