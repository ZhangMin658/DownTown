import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator, TextInput, Platform } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';
import { NavigationActions } from 'react-navigation';
import { CheckBox } from 'react-native-elements';
import Modal from "react-native-modal";
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import EventComponent from './EventComponent';

class PublicEvents extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loadmore: false,
      reCaller: false,
      sorting: false,
      search: ''
    }
  }
  navigateToScreen = (route, title) => {
    const navigateAction = NavigationActions.navigate({
      routeName: route
    });
    this.props.navigation.setParams({ otherParam: title });
    this.props.navigation.dispatch(navigateAction);
  }
  componentWillMount = async () => {
    await this.getSearchList();
  }
  componentDidMount = async() => {
    await this.interstitial() 
  }
  interstitial = () => {        
    let data = store.settings.data;
    try {
      if ( data.has_admob && data.admob.interstitial !== '' ) {
         AdMobInterstitial.setAdUnitID(data.admob.interstitial); //ca-app-pub-3940256099942544/1033173712
         AdMobInterstitial.requestAd().then(() => AdMobInterstitial.showAd()); 
      }
    // InterstitialAdManager.showAd('636005723573957_636012803573249')
    //   .then(didClick => console.log('response===>>>',didClick))
    //   .catch(error => console.log('error===>>>',error)); 
    } catch (error) {
        console.log('catch===>>>',error);
    }
 }
  getSearchList = async () => {
    let { params } = this.props.navigation.state;
    if (this.state.search.length !== 0) {
      store.SEARCH_OBJ_EVENT.by_title = this.state.search;
    }
    // else {
    //   store.SEARCH_OBJ_EVENT.by_title = this.state.search;
    // }
    // console.log('object==>>>', store.SEARCH_OBJ_EVENT);

    this.setState({ loading: true })
    try {
      let response = await ApiController.post('event-search', store.SEARCH_OBJ_EVENT);
      // console.log('PublicEvents===>>', response);
      if (response.success) {
        store.EVENTS = response;
        await this.eventSearch();
        // this.setState({ loading: false })
      } else {
        store.EVENTS = response;
        this.setState({ loading: false })
      }
    } catch (error) {
      console.log('error:', error);
    }
  }

  eventSearch = async () => {
    // this.setState({ loading: true })
    try {
      let response = await ApiController.post('events-filters');
      // console.log('event search==>>', response);
      if (response.success) {
        store.LISTING_FILTER_EVENTS = response;
        this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      console.log('error', error);
      this.setState({ loading: false })
    }
  }

  static navigationOptions = { header: null };

  _sort = () => this.setState({ sorting: !this.state.sorting })

  resetSearchList = async () => {
    store.SEARCH_OBJ_EVENT = {};
    this.setState({ loading: true, search: '' })
    try {
      let response = await ApiController.post('event-search');
      // console.log('PublicEvents===>>', response);
      if (response.success) {
        store.EVENTS = response;
        this.setState({ loading: false })
      } else {
        this.setState({ loading: false })
      }
    } catch (error) {
      console.log('error:', error);
    }
  }
  _sortingModule = async (item, options) => {
    // store.SEARCH_OBJ = {};
    options.forEach(func = async (option) => {
      if (option.key === item.key) {
        store.SEARCH_OBJ_EVENT.sort_by = item.key;
        this.setState({ sorting: false })
        await this.getSearchList()
        // console.warn('object===>>>',store.SEARCH_OBJ);
      } else {
        option.checkStatus = false;
      }
    })
  }
  loadMore = async (pageNo) => {
    let params = {
      next_page: pageNo
    }
    this.setState({ loadmore: true })
    var data = store.EVENTS.data;
    let response = await ApiController.post('event-search', params);
    // console.log('loadMore=====>>>', response);
    if (response.success && data.pagination.has_next_page) {
      //forEach Loop LoadMore results
      response.data.eventz.forEach((item) => {
        data.eventz.push(item);
      })
      data.pagination = response.data.pagination;
      this.setState({ loadmore: false })
    } else {
      this.setState({ loadmore: false })
      // Toast.show(response.data.no_more)
    }
    this.setState({ reCaller: false })
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render() {
    let main_clr = store.settings.data.main_clr;
    let home = store.home.homeGet.data.advanced_search;
    let data = store.SEARCHING.LISTING_FILTER.data;
    let settings = store.settings.data;
    return (
      <View style={{ flex: 1 }}>
        <View style={{ height: height(10), width: width(100), backgroundColor: store.settings.data.navbar_clr, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ height: height(7), width: width(90), backgroundColor: COLOR_PRIMARY, borderRadius: 5, flexDirection: 'row', alignItems: 'center' }}>
            <TextInput
              style={{ width: width(80), alignSelf: 'stretch', paddingHorizontal: 10 }}
              placeholder={home.search_placeholder}
              // placeholderTextColor={COLOR_SECONDARY}
              autoCorrect={true}
              autoFocus={store.moveToSearch ? false : false}
              returnKeyType='search'
              value={this.state.search}
              onChangeText={(value) => {
                this.setState({ search: value });
              }}
            />
            <TouchableOpacity onPress={() => { this.getSearchList() }}>
              <Image source={require('../../images/searching-magnifying.png')} style={{ height: height(3), width: width(5), resizeMode: 'contain' }} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: height(8), width: width(100), backgroundColor: 'rgba(0,0,0,0.9)', flexDirection: 'row', borderColor: 'white', borderWidth: 0, alignItems: 'center' }}>
          <TouchableOpacity style={{ height: height(5), width: width(33.3), flexDirection: 'row', borderRightWidth: 1, borderRightColor: 'rgba(241,241,241,0.2)', justifyContent: 'center', alignItems: 'center' }} onPress={() => {
            this.props.navigation.navigate('EventSearching', { headerTitle: store.LISTING_FILTER_EVENTS.screen_text.screen_title, navigateToScreen: this.navigateToScreen, getSearchList: this.getSearchList })
          }}>
            <Image source={require('../../images/filterNew.png')} style={{ height: height(3), width: width(5), resizeMode: 'contain', marginHorizontal: 5 }} />
            <Text style={{ color: 'white', fontSize: totalSize(1.8), fontWeight: '400' }}>{home.filter}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: height(5), width: width(33.3), flexDirection: 'row', borderRightWidth: 1, borderRightColor: 'rgba(241,241,241,0.2)', justifyContent: 'center', alignItems: 'center' }} onPress={this._sort} >
            <Image source={require('../../images/SortNew.png')} style={{ height: height(3), width: width(5), resizeMode: 'contain', marginHorizontal: 5 }} />
            <Text style={{ color: 'white', fontSize: totalSize(1.8), fontWeight: '400' }}>{home.sort}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: height(5), width: width(33.3), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }} onPress={() => this.resetSearchList()}>
            <Image source={require('../../images/reload.png')} style={{ height: height(3), width: width(5), resizeMode: 'contain', marginHorizontal: 5 }} />
            <Text style={{ color: 'white', fontSize: totalSize(1.8), fontWeight: '400' }}>{home.reset}</Text>
          </TouchableOpacity>
        </View>
        {
          this.state.loading ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size='large' color={main_clr} animating={true} />
            </View>
            :
            <ScrollView
              showsVerticalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                if (this.isCloseToBottom(nativeEvent)) {
                  if (this.state.reCaller === false) {
                    this.loadMore(store.EVENTS.data.pagination.next_page);
                  }
                  this.setState({ reCaller: true })
                }
              }}
              scrollEventThrottle={400}>
              {
                store.EVENTS.data === "" ?
                  <View style={{ height: height(70), justifyContent: 'center', alignItems: 'center' }}>
                    <Text>{store.EVENTS.message}</Text>
                  </View>
                  :
                  <View>
                    <View style={{ backgroundColor: COLOR_PRIMARY, marginBottom: 10, alignItems: 'flex-start' }}>
                      <Text style={{ fontSize: 16, color: COLOR_SECONDARY, marginHorizontal: 15, marginVertical: 10 }}>{store.EVENTS.data.total_events}</Text>
                    </View>
                    {
                      store.EVENTS.data.eventz.map((item, key) => {
                        return (
                          <EventComponent item={item} key={key} />
                        )
                      })
                    }
                    {
                      store.EVENTS.data.pagination.has_next_page ?
                        <View style={{ height: height(7), width: width(100), justifyContent: 'center', alignItems: 'center' }}>
                          {
                            this.state.loadmore ?
                              <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                              : null
                          }
                        </View>
                        :
                        null
                    }
                  </View>
              }
            </ScrollView>
        }
        <Modal
          animationInTiming={200}
          animationOutTiming={100}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          transparent={true}
          isVisible={this.state.sorting}
          onBackdropPress={() => this.setState({ sorting: false })}
          style={{ flex: 1 }}>
          <View style={{ height: height(5 + (data.sorting.option_dropdown.length * 6)), width: width(90), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
            <View style={{ height: height(7), width: width(90), flexDirection: 'row', borderBottomWidth: 0.5, alignItems: 'center', borderBottomColor: '#c4c4c4' }}>
              <View style={{ height: height(5), width: width(80), justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: totalSize(2), fontWeight: '500', color: COLOR_SECONDARY, marginHorizontal: 10 }}>{data.sorting.title}</Text>
              </View>
              <TouchableOpacity style={{ height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: store.settings.data.navbar_clr }} onPress={() => { this._sort() }}>
                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
            {
              store.EVENTS_SORTING.option_dropdown.map((item, key) => {
                return (
                  <TouchableOpacity key={key} style={{ height: height(5), width: width(90), flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}
                    onPress={() => { this._sortingModule(item, data.sorting.option_dropdown), item.checkStatus = !item.checkStatus }}
                  >
                    <View style={{ height: height(5), width: width(80), justifyContent: 'center', alignItems: 'flex-start' }}>
                      <Text style={{ fontSize: totalSize(1.6), color: item.checkStatus ? store.settings.data.navbar_clr : COLOR_SECONDARY, marginHorizontal: 10 }}>{item.value}</Text>
                    </View>
                    <View style={{ height: height(5), width: width(10), justifyContent: 'center', alignItems: 'center' }}>
                      <CheckBox
                        size={16}
                        uncheckedColor={COLOR_GRAY}
                        checkedColor={store.settings.data.navbar_clr}
                        containerStyle={{ backgroundColor: 'transparent', width: width(10), borderWidth: 0 }}
                        checked={item.checkStatus}
                        onPress={() => { this._sortingModule(item, data.sorting.option_dropdown), item.checkStatus = !item.checkStatus }}
                      />
                    </View>
                  </TouchableOpacity>
                );
              })
            }
          </View>
        </Modal>
        <View style={{ alignItems: 'center' }}>
          {
            settings.has_admob && settings.admob.banner !== '' ?
              <AdMobBanner
                adSize={Platform.OS === 'ios' ? "smartBanner" : "smartBannerLandscape"}
                adUnitID={settings.admob.banner} // 'ca-app-pub-3940256099942544/6300978111' 
                onAdFailedToLoad={async () => await this.setState({ loadAdd: false })}
                didFailToReceiveAdWithError={async () => await this.setState({ loadAdd: false })}
                onAdLoaded={async () => { await this.setState({ loadAdd: true }) }}
              />
              :
              null
          }
        </View>
      </View>
    );
  }
}
export default PublicEvents;
