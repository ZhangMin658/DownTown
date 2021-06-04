import React, { Component } from 'react';
import { Platform, Text, View, Image, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import { Icon } from 'react-native-elements';
import { observer } from 'mobx-react';
import ProgressImage from '../CustomTags/ImageTag';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Listing/FeaturedStyleSheet';
import { withNavigation } from 'react-navigation';

@observer class FeaturedListingBar extends Component<Props> {
    constructor(props, ctx) {
        super(props, ctx);
        this.state = {
            loading: false
        }
    }

    render() {
        let data = store.USER_PROFILE.data;
        let main_clr = store.settings.data.main_clr;
        let item = this.props.item;
        return (
            <TouchableOpacity style={styles.featuredFLItem} onPress={() => this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title })}>
                <ProgressImage source={{ uri: item.image }} style={styles.featuredImg} />
                <View style={{ height: height(15), width: width(32), position: 'absolute' }}>
                    {
                        this.props.reActiveOption ?
                            null
                            :
                            <View>
                                <View style={styles.triangleCorner}></View>
                                <Image source={require('../../images/starfill.png')} style={{ height: height(1.5), width: width(3), marginLeft: 4, marginTop: 4, position: 'absolute', resizeMode: 'contain' }} />
                            </View>
                    }
                    <View style={{ height: this.props.reActiveOption ? height(0) : height(5) }}></View>
                    <View style={{ width: width(30), alignItems: 'flex-start' }}>
                        <View style={[styles.closedBtn, { backgroundColor: item.color_code }]}>
                            <Text style={styles.closedBtnTxt}>{item.business_hours_status}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.txtViewCon}>
                    <View style={{ width: width(54), marginVertical: 3, alignItems:'flex-start' }}>
                        <Text style={styles.txtViewHeading}>{item.category_name}</Text>
                        <Text style={styles.viewDetail}>{item.listing_title}</Text>
                        <View style={{ height: height(3), alignItems: 'center', flexDirection: 'row' }}>
                            {/* <Image source={require('../../images/calendar.png')} style={{height:height(2.5),width:width(4),marginLeft:10,resizeMode:'contain'}} /> */}
                            <Icon
                                size={18}
                                name='calendar'
                                type='evilicon'
                                color='#a3a3a3'
                                containerStyle={{ marginLeft: 7, marginRight: 2, marginVertical: 0 }}
                            />
                            <Text style={styles.subHeadingTxt}>{item.posted_date}</Text>
                            <View style={{ marginHorizontal: 5, height: 10, width: 1, borderWidth: 0.3, borderColor: '#c4c4c4' }}></View>
                            {/* <View style={{ flexDirection: 'row' }}>
                                <Icon
                                    size={20}
                                    name='eye'
                                    type='evilicon'
                                    color='#a3a3a3'
                                    containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                                />
                                <Text style={styles.ratingTxt}>{item.total_views}</Text>
                            </View> */}
                        </View>
                    </View>
                    <TouchableOpacity style={{ flex: 1, height: height(13) }}>
                        <Menu>
                            <MenuTrigger>
                                <Image source={require('../../images/menu.png')} style={{ height: height(5), width: width(5), marginLeft: 5, resizeMode: 'contain' }} />
                            </MenuTrigger>
                            <MenuOptions>
                                {
                                    this.props.reActiveOption !== true ?
                                        <MenuOption onSelect={() => { this.props.navigation.push('ListingPostTabCon', { list_id: item.listing_id }), store.LISTING_UPDATE = true }}>
                                            <View style={{ flexDirection: 'row', }}>
                                                <Image source={require('../../images/pencil-edit-button.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                                <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>{data.l_edit}</Text>
                                            </View>
                                        </MenuOption>
                                        :
                                        null
                                }
                                <MenuOption onSelect={async () => { await this.props._deleteListing(item.listing_id) }}>
                                    <View style={{ flexDirection: 'row', }}>
                                        <Image source={require('../../images/x-button.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                        <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>Delete</Text>
                                    </View>
                                </MenuOption>
                                {
                                    this.props.reActiveOption ?
                                        <MenuOption onSelect={async () => { await this.props._reActiveListing(item.listing_id) }}>
                                            <View style={{ flexDirection: 'row', }}>
                                                <Image source={require('../../images/google-analytics.png')} style={{ height: height(2.5), width: width(4), marginHorizontal: 5, resizeMode: 'contain' }} />
                                                <Text style={{ fontSize: totalSize(1.4), marginHorizontal: 5, color: 'black' }}>ReActive</Text>
                                            </View>
                                        </MenuOption>
                                        :
                                        null
                                }
                            </MenuOptions>
                        </Menu>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
}

export default withNavigation(FeaturedListingBar)