import React, { Component } from 'react';
import { Alert, Text, View, Image, RefreshControl, ScrollView, ActivityIndicator } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast'
import FeatureDetailTabBar from './FeaturedListingBar';
import ApiController from '../../ApiController/ApiController';
import styles from '../../../styles/Listing/FeaturedStyleSheet';
@observer export default class Featured extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: false
    }
  }
  static navigationOptions = {
    header: null,
  };
  componentWillMount = async () => {
    let data = store.USER_PROFILE.data.listing_types.featured_listings;
    if ( data.has_list ) {
      data.listing.forEach(item => {
        item.checkStatus = false;
        item.added = false;
        item.removed = false;
      }); 
    }
  }
  _pullToRefresh = async () => {
    this.setState({ refreshing: true })
    let params = {
      listing_type: 'featured',
      next_page: 1
    }
    let data = store.USER_PROFILE.data.listing_types.featured_listings;
    let response = await ApiController.post('pull-listings', params);
    // console.log('featured pullToRefresh=====>>>', response);
    if (response.success) {
      if (response.data.has_list) {
        // forEach Loop LoadMore results
        data.listing_count = response.data.listing_count;
        data.listing = response.data.listing;
        response.data.listing.forEach((item) => {
          item.checkStatus = false;
          item.removed = false;
          //data.listing.push(item);
        })
        data.featured_pagination = response.data.featured_pagination;
        // console.log('after Loop=======>>>',data.commnets);       
      } else {
        data.listing_count = response.data.listing_count;
        data.has_list = response.data.has_list;
        data.message = response.data.message;
      }
      await this.setState({ refreshing: false })
    } else {
      await this.setState({ refreshing: false })
      // Toast.show(response.data.no_more)
    }
  }
  listingDelConfirmation = (id) => {
    let data = store.USER_PROFILE.data.confirmation;
    Alert.alert(
      data.title,
      data.text,
      [
        {
          text: data.btn_cancle,
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        { text: data.btn_ok, onPress: () => this.deleteListing(id) },
      ],
      { cancelable: false },
    );
  }
  deleteListing = async (listing_id) => {
    this.setState({ loading: true })

    let data = store.USER_PROFILE.data.listing_types.featured_listings;
    data.listing.forEach(item => {
      if (listing_id === item.listing_id) {
        item.checkStatus = true;
      }
    })
    // passing listing_id to api class
    let params = {
      listing_id: listing_id
    }
    let response = await ApiController.post('listing-del', params);
    // console.log('delete Listing==========================>>', response);
    if (response.success) {
      data.listing.forEach(item => {
        if (listing_id === item.listing_id) {
          item.checkStatus = false;
          item.removed = true;
          // data.listing.splice(data.listing.indexOf(listing_id), 1);
        }
      })
      this.setState({ loading: false })
      Toast.show(response.message)
      // this.props.jumpTo('create');
    } else {
      Toast.show(response.message)
      data.listing.forEach(item => {
        if (listing_id === item.listing_id) {
          item.checkStatus = false;
        }
      })
      this.setState({ loading: false })
    }
  }
  loadMore = async (listType, pageNo) => {
    this.setState({ loadMore: true })
    let params = {
      listing_type: listType,
      next_page: pageNo
    }
    let data = store.USER_PROFILE.data.listing_types.featured_listings;
    let response = await ApiController.post('my-own-listings', params);
    // console.log('Tabs loadMore=====>>>', response);
    if (response.listing && data.featured_pagination.has_next_page) {
      // forEach Loop LoadMore results
      response.listing.forEach((item) => {
        data.listing.push(item);
      })
      data.featured_pagination = response.featured_pagination;
      await this.setState({ loadMore: false })
    } else {
      await this.setState({ loadMore: false })
      // Toast.show(response.data.no_more)
    }
    await this.setState({ reCaller: false })
  }

  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };

  render() {
    let data = store.USER_PROFILE.data;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={styles.container}>
        {
          data.listing_types.featured_listings.has_list ?
            <ScrollView
              showsVerticalScrollIndicator={false}
              onScroll={({ nativeEvent }) => {
                if (this.isCloseToBottom(nativeEvent)) {
                  if (this.state.reCaller === false) {
                    this.loadMore(data.listing_types.featured_listings.listing_type, data.listing_types.featured_listings.featured_pagination.next_page);
                  }
                  this.setState({ reCaller: true })
                }
              }}
              scrollEventThrottle={400}
              refreshControl={
                <RefreshControl
                  colors={['white']}
                  progressBackgroundColor={store.settings.data.main_clr}
                  tintColor={store.settings.data.main_clr}
                  refreshing={this.state.refreshing}
                  onRefresh={this._pullToRefresh}
                />
              }>
              <View style={{ backgroundColor: COLOR_PRIMARY, marginBottom: 10 }}>
                <Text style={{ marginVertical: 15, marginHorizontal: 10, fontWeight: 'bold', color: COLOR_SECONDARY }}>{data.listing_types.featured_listings.listing_count}</Text>
              </View>
              {
                data.listing_types.featured_listings.listing.map((item, key) => {
                  return (
                    <View key={key}>
                      {
                        item.removed ?
                          null
                          :
                          <FeatureDetailTabBar key={key} item={item} _deleteListing={this.listingDelConfirmation} reActiveOption={false} />
                      }
                    </View>
                  )
                })
              }
              {
                data.listing_types.featured_listings.featured_pagination.has_next_page ?
                  <View style={{ height: height(7), width: width(100), justifyContent: 'center', alignItems: 'center' }}>
                    {
                      this.state.loadMore ?
                        <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                        : null
                    }
                  </View>
                  :
                  null
              }
            </ScrollView>
            :
            <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
              <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
              <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.listing_types.featured_listings.message}</Text>
            </View>
        }
        {
          this.state.loading ?
            <View style={{ position: "absolute", justifyContent: 'center', alignItems: 'center', height: height(85), width: width(100), backgroundColor: 'rgba(0,0,0,0.7)' }}>
              <ActivityIndicator color='white' size='large' animating={true} />
            </View>
            :
            null
        }
      </View>
    );
  }
}
