import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import { createStackNavigator } from 'react-navigation';
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import { withNavigation } from 'react-navigation';
import ProfileUpperView from './ProfileUpperView';

class Events extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loadmore: false,
      reCaller: false,
    }
  }

  static navigationOptions = { header: null };

  _blog = (item, key) => {
    let data = store.PUB_PROFILE_DETAIL;
    return (
      <TouchableOpacity key={key} style={{ elevation: 5, marginVertical: 5, borderRadius: 5, marginHorizontal: 5, width: width(95), shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: 2 , alignSelf: 'center', backgroundColor: COLOR_PRIMARY, flexDirection: 'row' }}
        onPress={() => this.props.navigation.push('EventDetail', { event_id: item.event_id, title: item.event_title, headerColor: store.settings.data.navbar_clr })}
      >
        <View style={{ marginVertical: 2, width: width(36), justifyContent: 'center', alignItems: 'center' }}>
          <Image source={{ uri: item.image }} style={{ height: 110, width: width(35), alignSelf: 'center', borderRadius: 5 }} />
        </View>
        <View style={{ width: width(58), justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 0, marginVertical: 5 }}>
          <Text style={{ marginHorizontal: 7, fontSize: 11, marginBottom: 0 }} >{item.event_category_name}</Text>
          <Text style={{ marginHorizontal: 7, fontWeight: 'bold', color: COLOR_SECONDARY, marginBottom: 5, fontSize: 13 }} >{item.event_title}</Text>
          <View style={{ flexDirection: 'row', marginHorizontal: 7, marginBottom: 3, alignItems: 'center' }}>
            <Image source={require('../../images/clock-circular-outline.png')} style={{ height: height(2), width: width(5), resizeMode: 'contain' }} />
            <Text style={{ fontWeight: 'bold', fontSize: 12, color: COLOR_SECONDARY, marginHorizontal: 3 }}>{data.from}</Text>
            <Text style={{ fontSize: 11 }}>{item.event_start_date}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginHorizontal: 7, marginBottom: 3, alignItems: 'center' }}>
            <Image source={require('../../images/calendar.png')} style={{ height: height(2), width: width(5), resizeMode: 'contain' }} />
            <Text style={{ fontWeight: 'bold', fontSize: 12, color: COLOR_SECONDARY, marginHorizontal: 3 }}>{data.to}</Text>
            <Text style={{ fontSize: 11 }}>{item.event_end_date}</Text>
          </View>
          <View style={{ width: width(58), flexDirection: 'row', marginHorizontal: 7, marginBottom: 3, alignItems: 'center' }}>
            <Image source={require('../../images/paper-plane.png')} style={{ height: height(2), width: width(5), resizeMode: 'contain' }} />
            <Text style={{ height: height(2), fontWeight: 'bold', fontSize: 12, color: COLOR_SECONDARY, marginHorizontal: 3 }}>{data.venue}</Text>
            <Text style={{ fontSize: 11, flexWrap: 'wrap', width: width(38) }}>{item.event_loc}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  loadMore = async (pageNo) => {
    let params = {
      user_id: store.PUB_PROFILE_ID, //14
      event_next_page: pageNo
    }
    this.setState({ loadmore: true })
    var data = store.PUB_PROFILE_DETAIL;
    let response = await ApiController.post('author-detial', params);
    // console.log('loadMore=====>>>', response);
    if (response.success && data.event_pagination.has_next_event_page) {
      //forEach Loop LoadMore results
      response.data.events.forEach((item) => {
        data.events.push(item);
      })
      data.event_pagination = response.data.event_pagination;
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
    var data = store.PUB_PROFILE_DETAIL;
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.reCaller === false) {
                this.loadMore(data.event_pagination.next_page);
              }
              this.setState({ reCaller: true })
            }
          }}
          scrollEventThrottle={400}>
          <ProfileUpperView />
          {
            data.has_events ?
              <View>
                {
                  data.events.map((item, key) => {
                    return (
                      this._blog(item, key)
                    )
                  })
                }
                {
                  data.event_pagination.has_next_event_page ?
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
                <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.events_message}</Text>
              </View>
          }
        </ScrollView>
      </View>
    );
  }
}
export default withNavigation(Events)
