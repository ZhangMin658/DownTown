import React, { Component } from 'react';
import { Text, View, Image, ScrollView, ActivityIndicator } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import {  COLOR_SECONDARY } from '../../../styles/common';
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import ListingComponent from '../Home/ListingComponent';
import ProfileUpperView from './ProfileUpperView';
import { withNavigation } from 'react-navigation';

class Listings extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      // loading: false,
      loadmore: false,
      reCaller: false,
    }
  }
  
  static navigationOptions = { header: null };

  _blog = (item, key) => {
    return (
      <ListingComponent item={item} key={key} listStatus={true} />
    );
  }

  loadMore = async (pageNo) => {
    let params = {
      user_id: store.PUB_PROFILE_ID, //14
      listing_next_page: pageNo
    }
    this.setState({ loadmore: true })
    var data = store.PUB_PROFILE_DETAIL;
    let response = await ApiController.post('author-detial', params);
    // console.log('loadMore=====>>>', response);
    if (response.success && data.listing_pagination.has_next_page) {
      //forEach Loop LoadMore results
      response.data.listing.forEach((item) => {
        data.listing.push(item);
      })
      data.listing_pagination = response.data.listing_pagination;
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
    let data = store.PUB_PROFILE_DETAIL;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.reCaller === false && data.has_listings) {
                this.loadMore(data.listing_pagination.next_page);
              }
              this.setState({ reCaller: true })
            }
          }}
          scrollEventThrottle={400}>
          <ProfileUpperView data={store.PUB_PROFILE_DETAIL} />
          {
            data.has_listings ?
              <View>
                {
                  data.has_listings ?
                    data.listing.map((item, key) => {
                      return (
                        this._blog(item, key)
                      )
                    })
                    :
                    null
                }
                {
                  data.listing_pagination.has_next_page ?
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
              :
              <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.listing_message}</Text>
              </View>
          }
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(Listings);
