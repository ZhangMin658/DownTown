import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import ProgressImage from '../CustomTags/ImageTag';
import store from '../../Stores/orderStore';
import { withNavigation } from 'react-navigation';

class EventComponent extends Component<Props> {
 
  render = () => {
    let item = this.props.item;  
    let data = store.EVENTS.data;
    return (
      <TouchableOpacity style={{ elevation: 5, marginVertical: 5, borderRadius: 5, marginHorizontal: 5, width: width(95), shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: 2 , alignSelf: 'center', backgroundColor: COLOR_PRIMARY, flexDirection: 'row' }}
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
}
export default withNavigation(EventComponent);
