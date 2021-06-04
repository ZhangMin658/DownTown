import React, { Component } from 'react';
import { Text, View, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { COLOR_PRIMARY, COLOR_SECONDARY } from '../../../styles/common';
import store from '../../Stores/orderStore';
import ApiController from '../../ApiController/ApiController';
import { withNavigation } from 'react-navigation';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';

class MyEventComp extends Component<Props> {
    constructor() {
        super();
        this.state = {
            loading: false
        }
    }
    render = () => {
        let item = this.props.item;
        let data = store.MY_EVENTS.data;
    
        return (
            <View style={{ flex:1 }}>
                <TouchableOpacity style={{ elevation: 5, backgroundColor: item.checkStatus?'rgba(0,0,0,0.5)':COLOR_PRIMARY,marginVertical: 5, borderRadius: 5, marginHorizontal: 5, width: width(95), shadowColor: 'gray', shadowOpacity: 0.2, shadowRadius: 2, alignSelf: 'center', flexDirection: 'row' }}
                    onPress={() => this.props.navigation.push('EventDetail', { event_id: item.event_id, title: item.event_title, headerColor: store.settings.data.navbar_clr })}
                >
                    <View style={{ marginVertical: 2, width: width(36), justifyContent: 'center', alignItems: 'center' }}>
                        <Image source={{ uri: item.image }} style={{ height: 110, width: width(35), alignSelf: 'center', borderRadius: 5 }} />
                    </View>
                    <View style={{ width: width(52), justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 0, marginVertical: 5 }}>
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
                            <View style={{ width: width(38), alignItems:'flex-start' }}>
                                <Text style={{ fontSize: 11, flexWrap: 'wrap' }}>{item.event_loc}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ height: 100, width: 25, alignSelf: 'center' }}>
                        <Menu>
                            <MenuTrigger>
                                <Image source={require('../../images/menu.png')} style={{ height: height(3.5), width: width(5), resizeMode: 'contain' }} />
                            </MenuTrigger>
                            <MenuOptions>
                                {
                                    this.props.options === 'published' ?
                                        <View>
                                            <MenuOption onSelect={async () => { await this.props.upDateGet(item.event_id) }}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Image source={require('../../images/pencil-edit-button.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>{data.e_edit}</Text>
                                                </View>
                                            </MenuOption>
                                            <MenuOption onSelect={async () => { await this.props._deleteEvent(item.event_id) }}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Image source={require('../../images/x-button.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>{data.e_delete}</Text>
                                                </View>
                                            </MenuOption>
                                            <MenuOption onSelect={async () => { await this.props._expiredEvents(item.event_id) }}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Image source={require('../../images/error-triangle.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>{data.e_expire}</Text>
                                                </View>
                                            </MenuOption>
                                        </View>
                                        :
                                        null
                                }
                                {
                                    this.props.options === 'expired' ?
                                        <View>
                                            <MenuOption onSelect={async () => { await this.props._deleteEvent(item.event_id) }}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Image source={require('../../images/x-button.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>Delete</Text>
                                                </View>
                                            </MenuOption>
                                            <MenuOption onSelect={async () => { await this.props._reActive(item.event_id) }}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Image source={require('../../images/google-analytics.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>Reactive</Text>
                                                </View>
                                            </MenuOption>
                                        </View>
                                        :
                                        null
                                }
                                {
                                    this.props.options === 'pending' ?
                                        <View>
                                            <MenuOption onSelect={async () => { await this.props._upDateGet(item.event_id) }}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Image source={require('../../images/pencil-edit-button.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>Edit</Text>
                                                </View>
                                            </MenuOption>
                                            <MenuOption onSelect={async () => { await this.props._deleteEvent(item.event_id) }}>
                                                <View style={{ flexDirection: 'row', }}>
                                                    <Image source={require('../../images/x-button.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                                    <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>Delete</Text>
                                                </View>
                                            </MenuOption>
                                        </View>
                                        :
                                        null
                                }
                            </MenuOptions>
                        </Menu>
                    </View>
                </TouchableOpacity>
                {
                    item.checkStatus ?
                        <View style={{ position: "absolute",justifyContent: 'center', marginVertical: 5, borderRadius: 5, marginHorizontal: 5, height: Platform.OS === 'android'? height(17) : height(14), width: width(94), alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
                            <ActivityIndicator color='white' size='large' animating={true} />
                        </View>
                        :
                        null
                }
            </View>
        );
    }
}
export default withNavigation(MyEventComp);