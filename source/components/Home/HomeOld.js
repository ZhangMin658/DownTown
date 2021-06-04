


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
// import { BannerView } from 'react-native-fbads';
import { width, height, totalSize } from 'react-native-dimension';
import { NavigationActions } from 'react-navigation';
import { observer } from 'mobx-react';
import StarRating from 'react-native-star-rating';
import Marker from 'react-native-vector-icons/FontAwesome5';
import * as Animatable from 'react-native-animatable';
import store from '../../Stores/orderStore';
import styles from '../../../styles/HomeOld';
import ApiController from '../../ApiController/ApiController';
import ListingComponent from './ListingComponentOld';
import EventComponent from './EventComponent';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';



@observer export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    }
  }
  // static navigationOptions = { header: null };
  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state;
    return {
      headerTitle: 'aaaaaaaaa' +store.settings.data.menu.adv_search,
      headerStyle: {
        backgroundColor: store.settings.data.navbar_clr,
      },
      headerTintColor: COLOR_PRIMARY,
      headerTitleStyle: {
        fontSize: totalSize(2.2),
      },
      headerRight: (
        <TouchableOpacity onPress={() => { _this.getCurrentPosition() }}>
          {
           <Image source={require('../../images/map-placeholder.png')} style={{ height: 20, width: 25, marginRight: 15, resizeMode: 'contain' }} />
          }
        </TouchableOpacity>
      )
    }
  };
  navigateToScreen = (route, title) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.setParams({ otherParam: title });
    this.props.navigation.dispatch(navigateAction);
  }
  UNSAFE_componentWillMount = async () => {
    // calling homeData func

    // jwt
    // .sign({
    // amount: 250, // The amount you need the customer to pay. 250 is the minimum.
    // serviceType: "My Service Type", // This is a free text and it's will appear to the customer in the payment page.
    // msisdn: "9647835077880", // The merchant wallet number in string form
    // orderId: 'YOUR ORDER ID', // Free text, you need to write your invoice id from your DB, U will use in the redirection
    // redirectUrl: "https://YOUR-WEBSITE.com/payment/redirect", // Your GET URL that ZC will redirect to after the payment got completed
    // iat: 100000, // Time for the JWT token
    // exp: 100000 + 60 * 60 * 4 // Time for the JWT token
    //   }, // body
    //   "$2y$10$xlGUesweJh93EosHlaqMFeHh2nTOGxnGKILKCQvlSgKfmhoHzF12G", // secret
    //   {
    //     alg: "HS256"
    //   }
    // )
    // .then((token)=>{
    //   console.log('token',token)
    // }) // token as the only argument
    // .catch(console.error); // possible errors
  

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
      // console.log('responseHome==>>>>>', response);
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
            <View style={styles.topViewCon}>
              <View style={styles.InnerRadius}>
                <View style={styles.imageCon}>
                  <ImageBackground indicator={null} source={{ uri: home.search_section.image }} style={{ flex: 1, resizeMode: 'contain' }}>
                    <View style={{ height: height(40), alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.7)' }}>
                      <View style={[styles.findTxtCon, {flexDirection : 'row', justifyContent : 'flex-start', alignItems : 'flex-end'}]}>
                        <Text style={styles.firTxt}>Encuentra experiencias </Text>
                        <Text style = {{color : store.CUR_CITY.name == null ? 'red' : 'white', fontSize : 18, fontWeight : 'bold'}}
                            onPress = {() => {if(store.CUR_CITY.name == null) this.props.navigation.push('SelectCity', {'otherParam' :'Select city'})}}  >
                          {store.CUR_CITY.name == null ? 'select city' : store.CUR_CITY.name}
                        </Text>
                      </View>
                      <Text style={styles.secTxt}>{home.search_section.sub_title}</Text>
                      <View style={styles.searchCon}>
                        <TextInput
                          onChangeText={(value) => this.setState({ searchtxt: value })}
                          underlineColorAndroid='transparent'
                          placeholder={home.search_section.placeholder}
                          // placeholderTextColor='black'
                          underlineColorAndroid='transparent'
                          autoCorrect={false}
                          // onFocus={() => this.navigateToScreen('SearchingScreen', 'search')}
                          style={[styles.txtInput, I18nManager.isRTL ? { textAlign: 'right' } : { textAlign: 'left' }]}
                        />
                        <Icon
                          size={30}
                          name='search'
                          type='evilicon'
                          color='black'
                          containerStyle={{ marginLeft: 0, marginVertical: 10 }}
                          // containerStyle={styles.searchIcon}
                          onPress={() => {
                            store.SEARCHTEXT = this.state.searchtxt,
                            store.moveToSearchTXT = true
                            store.moveToSearchLoc=false
                            store.moveToSearch=false
                            store.SEARCH_OBJ = {};

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
                          }}
                        // onPress={() => this.navigateToScreen('SearchingScreen', 'search')}
                        />
                        {/* <Image
                          source={require('../../images/search_black.png')}
                          style={styles.searchIcon}
                          onPress={() => this.navigateToScreen('SearchingScreen', 'search')}
                        /> */}
                      </View>
                    </View>
                  </ImageBackground>
                </View>
              </View>
            </View>
            {
              home.categories_enabled ?
                <View style={{ flex: 1, width: width(100), backgroundColor: 'transparent', alignItems: 'center', position: 'absolute', marginVertical: 190 }}>
                  <View style={styles.flatlistCon}>
                    <FlatList
                      data={home.categories}
                      renderItem={({ item, key }) =>
                        <TouchableOpacity key={key} style={styles.flatlistChild}
                          onPress={() => {
                            store.CATEGORY = item,
                            store.SEARCH_OBJ = {};
                            store.moveToSearchTXT = false
                            store.moveToSearchLoc=false
                            store.moveToSearch = true,
                              this.navigateToScreen('SearchingScreen', data.menu.adv_search)
                          }}
                        >
                          <Animatable.View
                            duration={2000}
                            animation="zoomIn"
                            iterationCount={1}
                            direction="alternate">
                            <Image style={{ height: height(6), width: width(15), resizeMode: 'contain' }} source={{ uri: item.img }} />
                          </Animatable.View>
                          <Text style={[styles.childTxt, { fontWeight: 'bold', fontSize : 10 }]}>{item.name}</Text>
                        </TouchableOpacity>
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
            {
              home.listings_enabled ?
                <View style={{ width: width(90), flexDirection: 'row', alignSelf: 'center', alignItems: 'center', marginTop: Platform.OS === 'ios' ? 35 : 35, marginBottom: 5 }}>
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Text style={styles.recList}>{home.section_txt}</Text>
                  </View>
                  <TouchableOpacity style={[styles.readMoreBtnCon, { borderColor: store.settings.data.navbar_clr }]} onPress={() => this.navigateToScreen('SearchingScreen', data.menu.adv_search)}>
                    <Text style={[styles.latestFeature, { fontSize: 13 }]}>{home.section_btn}</Text>
                  </TouchableOpacity>
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
              home.featured_enabled && home.featured_listings.has_featured_listings ?
                <View style={{ width: width(100), marginTop: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: '#232323' }}>
                  <View style={{ marginHorizontal: 20, width: width(90) }}>
                    <Text style={{ marginVertical: 20, fontSize: 16, color: COLOR_PRIMARY }}>{home.featured_list_txt}</Text>
                  </View>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={{ marginHorizontal: 20 }}>
                    {
                      home.featured_listings.list.map((item, key) => {
                        return (
                          <TouchableOpacity style={{ width: width(55), backgroundColor: 'white', borderRadius: 5, marginRight: 10, marginBottom: 30 }} onPress={() => { store.LIST_ID = item.listing_id, this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
                            <Image indicator={null} source={{ uri: item.image }} style={{ height: 160, width: width(55), borderTopLeftRadius: 5, borderTopRightRadius: 5 }} />
                            <View style={{ height: height(5), width: width(32), position: 'absolute' }}>
                              <View>
                                <View style={styles.triangleCorner}></View>
                                <Icon
                                  size={16}
                                  name='star'
                                  type='entypo'
                                  color='white'
                                  containerStyle={{ marginLeft: 0, marginRight: 3, marginTop: 2, position: 'absolute', resizeMode: 'contain' }}
                                />
                                {/* <Image source={require('../../images/starfill.png')} style={{ height: height(1.5), width: width(3), marginLeft: 4, marginTop: 4, position: 'absolute', resizeMode: 'contain' }} /> */}
                              </View>
                            </View>
                            <Text style={{ fontSize: 11, color: 'gray', marginHorizontal: 7, marginTop: 10, width: width(45) }}>{item.category_name}</Text>
                            <Text style={{ fontSize: 13, fontWeight: 'bold', color: COLOR_SECONDARY, marginHorizontal: 7, marginTop: 3, marginBottom: 5 }}>{item.listing_title}</Text>
                            <View style={{ marginBottom: 8, width: width(45), marginHorizontal: 5, flexDirection: 'row', alignItems: 'center' }}>
                              <Icon
                                size={18}
                                name='calendar'
                                type='evilicon'
                                color='#8a8a8a'
                                containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                              />
                              <Text style={{ fontSize: 10, color: '#8a8a8a' }}>{item.posted_date}</Text>
                            </View>
                            <View style={{ height: height(4), width: width(55), borderTopColor: '#cccccc', flexDirection: 'row', borderTopWidth: 0.3 }}>
                              <View style={{ width: width(27.5), justifyContent: 'center' }}>
                                <Text style={{ fontSize: totalSize(1.2), color: item.color_code, fontWeight: 'bold', marginHorizontal: 7 }}>{item.business_hours_status}</Text>
                              </View>
                              <View style={{ width: width(27.5), justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Icon
                                  size={20}
                                  name='heart'
                                  type='evilicon'
                                  color='#8a8a8a'
                                  containerStyle={{ marginHorizontal: 10 }}
                                  onPress={() => console.warn('Love')}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    }
                  </ScrollView>
                </View>
                :
                null
            }

            {
              home.location_enabled ?
                <View style={{ marginHorizontal: 20 }}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: COLOR_SECONDARY, marginVertical: 15 }}>{home.sb_wpml_best_location_title}</Text>
                  <View style={{ flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center' }}>
                    {
                      home.location_list.map((item, key) => {
                        return (
                          <TouchableOpacity style={{ height: height(16), width: width(43), marginRight: this.isOdd(key) ? width(3) : 0, marginVertical: 5, alignItems: 'center' }}
                            onPress={() => {
                              store.LOCATION = item,
                               store.SEARCH_OBJ = {};
                               store.moveToSearchTXT = false
                               store.moveToSearch = false,
                                store.moveToSearchLoc = true,
                                this.navigateToScreen('SearchingScreen', data.menu.adv_search)
                            }}>
                            <View style={{ height: 30 }} />
                            <View style={{ height: height(12), width: width(43.5), justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', borderRadius: 5, shadowOpacity: 0.2, elevation: 2 }}>
                              <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY, marginTop: 8 }}>{item.location_name}</Text>
                              <Text style={{ fontSize: totalSize(1.7), color: COLOR_SECONDARY, marginTop: 4 }}>{home.sb_wpml_see_all_title}</Text>
                              {/* <Text style={{ fontSize: totalSize(1.7), color: COLOR_SECONDARY, marginTop: 4 }}>{item.location_ads}</Text> */}
                            </View>
                            <View style={{ height: height(10), width: width(22), position: 'absolute' }}>
                              <Avatar
                                size="medium"
                                rounded
                                source={{ uri: item.location_image }}
                                containerStyle={{ alignSelf: 'center', resizeMode: 'contain', marginHorizontal: 10, elevation: 2, shadowOpacity: 0.2 }}
                                // onPress={() => this.props.navigation.push('PublicProfileTab', { profiler_id: item.user_id, user_name: item.user_name })}
                                activeOpacity={1}
                              />
                            </View>
                          </TouchableOpacity>
                        )
                      })
                    }
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
                  <TouchableOpacity style={[styles.readMoreBtnCon, { borderColor: store.settings.data.navbar_clr }]} onPress={() => this.navigateToScreen('PublicEvents', 'Home')}>
                    <Text style={[styles.latestFeature, { fontSize: 13 }]}>{home.view_all_events}</Text>
                  </TouchableOpacity>
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