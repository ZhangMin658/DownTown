import React, { Component } from 'react';
import { Text, View, Image, ScrollView, RefreshControl } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import MyEventComp from './MyEventComp';
import store from '../../Stores/orderStore';
import ApiController from '../../ApiController/ApiController';
import EventsUpperView from './EventsUpperView';
import Toast from 'react-native-simple-toast';
export default class PublishedEvents extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loadMore: false,
      reCaller: false,
      loading: false,
      refreshing: false
    }
  }
  static navigationOptions = { header: null };
  componentWillMount = async () => {
    let data = store.MY_EVENTS.data.my_events.expired_events;
    if (data.has_events) {
      data.events.forEach(item => {
        item.checkStatus = false;
        item.delete = false;
      }) 
    }
  }
  deleteEvent = async (event_id) => {
    let data = store.MY_EVENTS.data.my_events.expired_events.events;
    data.forEach(item => {
      if (event_id === item.event_id) {
        item.checkStatus = true;
        this.setState({ loading: false })
      }
    })
    // passing event_id to api class
    let params = {
      event_id: event_id
    }
    let response = await ApiController.post('delete-event', params);
    //console.log('delete event==========================>>',response);
    if (response.success) {
      data.forEach(item => {
        if (event_id === item.event_id) {
          item.checkStatus = false;
          item.delete = true;
          // data.splice(data.indexOf(event_id),1);
          // this.setState({ loading: false })
        }
      })
      this.setState({ loading: false })
      Toast.show(response.message)
      // this.props.jumpTo('create');
    } else {
      Toast.show(response.message)
      data.forEach(item => {
        if (event_id === item.event_id) {
          item.checkStatus = false;
        }
      })
      this.setState({ loading: false })
    }
  }
  reActive = async (event_id) => {
    let data = store.MY_EVENTS.data.my_events.expired_events.events;
    let active = store.MY_EVENTS.data.my_events.active_events.events;
    data.forEach(item => {
      if (event_id === item.event_id) {
        item.checkStatus = true;
        this.setState({ loading: false })
      }
    })
    // passing event_id to api class
    let params = {
      event_id: event_id
    }
    let response = await ApiController.post('reactive-event', params);
    //console.log('delete event==========================>>',response);
    if (response.success) {
      data.forEach(item => {
        if (event_id === item.event_id) {
          item.checkStatus = false;
          item.delete = true;
          item.removed = false;
          // data.splice(data.indexOf(event_id),1);
          active.push(item);
          this.setState({ loading: false })
        }
      })
      this.setState({ loading: false })
      Toast.show(response.message)
      // this.props.jumpTo('create');
    } else {
      Toast.show(response.message)
      data.forEach(item => {
        if (event_id === item.event_id) {
          item.checkStatus = false;
        }
      })
      this.setState({ loading: false })
    }
  }
  _pullToRefresh = async (listType, pageNo) => {
    this.setState({ refreshing: true })
    let params = {
      event_type: 'expired',
      next_page: 1
    }
    let data = store.MY_EVENTS.data.my_events.expired_events;
    let response = await ApiController.post('load-my-events', params);
    console.log('Tabs expired refreshing=====>>>', response);
    if (response.has_events) {
      // forEach Loop refreshing results
      data.event_count = response.event_count;
      data.events = response.events;
      response.events.forEach((item) => {
        item.checkStatus = false;
        item.delete = false;
        //data.events.push(item);
      })
      data.expired_pagination = response.expired_pagination;
      // console.log('after Loop=======>>>',data.commnets);        
      await this.setState({ refreshing: false })
    } else {
      data.event_count = response.event_count;
      data.has_events = response.has_events;
      await this.setState({ refreshing: false })
      // Toast.show(response.data.no_more)
    }
    await this.setState({ reCaller: false })
  }
  loadMore = async (listType, pageNo) => {
    this.setState({ loadMore: true })
    let params = {
      event_type: listType,
      next_page: pageNo
    }
    let data = store.MY_EVENTS.data.my_events.expired_events;
    let response = await ApiController.post('load-my-events', params);
    // console.log('Tabs loadMore=====>>>', response);
    if (response.has_events && data.expired_pagination.has_next_page) {
      // forEach Loop LoadMore results
      response.events.forEach((item) => {
        item.checkStatus = false;
        item.delete = false;
        data.events.push(item);
      })
      data.expired_pagination = response.expired_pagination;
      // console.log('after Loop=======>>>',data.commnets);        
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
    let data = store.MY_EVENTS.data.my_events;
    return (
      <View style={{ flex: 1, alignItems: 'center', backgroundColor: '#f9f9f9' }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              colors={['white']}
              progressBackgroundColor={store.settings.data.main_clr}
              tintColor={store.settings.data.main_clr}
              refreshing={this.state.refreshing}
              onRefresh={this._pullToRefresh}
            />
          }
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.reCaller === false) {
                this.loadMore(data.expired_events.event_type, data.expired_events.expired_pagination.next_page);
              }
              this.setState({ reCaller: true })
            }
          }}
          scrollEventThrottle={400}>
          <EventsUpperView />
          <View style={{ backgroundColor: COLOR_PRIMARY, marginBottom: 10 }}>
            <Text style={{ marginVertical: 15, marginHorizontal: 10, fontWeight: 'bold', color: COLOR_SECONDARY }}>{data.expired_events.event_count}</Text>
          </View>
          {
            data.expired_events.has_events ?
              data.expired_events.events.map((item, key) => {
                return (
                  <View key={key}>
                    {
                      item.delete ?
                        null
                        :
                        <MyEventComp item={item} key={key} options={'expired'} jumpTo={this.props.jumpTo} _deleteEvent={this.deleteEvent} _reActive={this.reActive} />
                    }
                  </View>
                );
              })
              :
              <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.expired_events.message}</Text>
              </View>
          }
          {
            data.expired_events.expired_pagination.has_next_page ?
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
      </View>
    );
  }
}