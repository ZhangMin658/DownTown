import React, { Component } from 'react';
import { Platform, Text, View, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_PINK } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import Toast from 'react-native-simple-toast';
import { withNavigation } from 'react-navigation';
import * as Animatable from 'react-native-animatable';
import ApiController from '../../ApiController/ApiController';
import styles from '../../../styles/UserDashboardStyles/DashboardStyleSheet';
import UpperView from './UpperView';

class Dashboard extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      loadMoreBtn: true
    }
  }
  static navigationOptions = { header: null };

  loadMore = async (pagination) => {
    this.setState({ loading: true })
    let leads = store.USER_PROFILE.data.dashboard_notifications;
    let params = {
      next_page: pagination.next_page
    };
    let response = await ApiController.post('get-more-leads', params);
    // console.log('response======>>>>>>>>>',response);
    if (response.success === true) {
      response.data.lead_activities.forEach(item => {
        leads.data.lead_activities.push(item);
      });
      leads.data.pagination = response.data.leads_pagination;
      this.setState({ loading: false })
    } else {
      this.setState({ loading: false, loadMoreBtn: false })
      Toast.show(response.message)
      // console.warn('error');
    }
  }
  render() {
    let leads = store.USER_PROFILE.data.dashboard_notifications;
    let plan = store.USER_PROFILE.data.package_info;
    return (
      <View style={styles.container}>
        <ScrollView>
          <UpperView />
          <View style={styles.titleCon}>
            <Text style={styles.titleTxt}>{store.USER_PROFILE.extra_text.dashboard_text}</Text>
          </View>
          {
            leads.success ?
              leads.data.lead_activities.map((item, key) => {
                return (
                  <View key={key} style={{ width: width(92), flexDirection: 'row', justifyContent: 'center', marginHorizontal: 15, marginVertical: 5, borderBottomWidth: 0.4, borderColor: 'gray' }}>
                    <View style={{ justifyContent: 'center' }}>
                      <Animatable.View
                        duration={1000}
                        animation="tada"
                        easing="ease-out"
                        iterationCount={'infinite'}
                        direction="alternate">
                        <Image source={item.icon_type === 'like' ? require('../../images/like.png') : item.icon_type === 'emoji' ? require('../../images/emoji.png') : item.icon_type === 'love' ? require('../../images/love.png') : item.icon_type === 'dislike' ? require('../../images/dislike.png') : item.icon_type === 'star' ? require('../../images/star.png') : item.icon_type === 'comment' ? require('../../images/comment.png') : null} style={{ height: height(5), width: width(7), resizeMode: 'contain', marginRight: 10 }} />
                      </Animatable.View>
                    </View>
                    <View style={{ flex: 1, alignSelf: 'stretch', justifyContent: 'center' }}>
                      <View style={{ flexDirection: 'row', marginVertical: 2 }}>
                        <TouchableOpacity onPress={() => this.props.navigation.push('PublicProfileTab', { profiler_id: item.user_id, user_name: item.user_name })}>
                          <Text style={styles.bellText}>{item.user_name}</Text>
                        </TouchableOpacity>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                          <Text style={styles.time}>{item.activity_time}</Text>
                        </View>
                      </View>
                      <TouchableOpacity style={{ flexDirection: 'row', marginVertical: 2, flexWrap: 'wrap', justifyContent: 'flex-start' }} onPress={() => this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title })}>
                        <Text style={styles.label1}>{item.statement}</Text>
                        <Text style={styles.label2}>{item.listing_title}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                );
              })
              :
              <View style={styles.subTitleCon}>
                <Text style={styles.subTitleTxt}>{leads.message}</Text>
              </View>
          }
          {
            this.state.loadMoreBtn && leads.success ?
              <TouchableOpacity style={{ borderRadius: 3, backgroundColor: 'red', alignSelf: 'center', marginVertical: 10 }} onPress={() => { this.loadMore(leads.data.pagination) }}>
                {
                  this.state.loading ?
                    <View style={{ marginHorizontal: 10, marginVertical: 3 }}>
                      <ActivityIndicator color={COLOR_PRIMARY} animating={true} size='small' />
                    </View>
                    :
                    <Text style={{ marginHorizontal: 10, marginVertical: 3, fontSize: 12, color: COLOR_PRIMARY }}>Load More</Text>
                }
              </TouchableOpacity>
              :
              null
          }
          {/* <View style={styles.planBox}>
            <View style={styles.boxTitleCon}>
              <Text style={styles.boxTitleTxt}>{plan.heading}</Text>
            </View>
            <View style={{height:height(8)}}>
              <Text style={styles.boxMessage}>{plan.desc}</Text>
            </View>
            <View style={{ alignItems:'center',alignSelf:'flex-start' }}>
              <TouchableOpacity style={styles.viewBtn}>
                <Text style={styles.btnTxt}>{plan.btn_txt}</Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </ScrollView>
      </View>
    );
  }
}

export default withNavigation(Dashboard);