import React, { Component } from 'react';
import { Text, View, TouchableOpacity, Linking } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { Avatar, Icon } from 'react-native-elements';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import store from '../../Stores/orderStore';
export default class ProfileUpperView extends Component<Props> {
    constructor(props) {
        super(props);
        this.state = {
            is_about: false
        }
    }

    static navigationOptions = { header: null };

    social_service = (url) => {
        if (url !== "") {
            Linking.openURL(url);
        }
    }

    render() {
        let navbar_clr = store.settings.data.navbar_clr;
        let main_clr = store.settings.data.main_clr;
        let data = store.PUB_PROFILE_DETAIL;
        return (
            <View style={{ width: width(100), marginBottom: 7, backgroundColor: COLOR_PRIMARY, borderBottomWidth: 0.4, borderBottomColor: '#ccc' }}>
                <View style={{ alignItems: 'center' }}>
                    <Avatar
                        size="large"
                        rounded
                        source={{ uri: data.user_img }}
                        // onPress={() => console.warn("Works!")}
                        activeOpacity={1}
                        containerStyle={{ marginHorizontal: 20, marginTop: 15 }}
                    />
                    <Text style={{ fontSize: totalSize(2.5), fontWeight: 'bold', color: COLOR_SECONDARY, marginHorizontal: 0 }}>{data.user_name}</Text>
                    <View style={{ height: height(7), flexDirection: 'row', marginVertical: 5, marginHorizontal: 20 }}>
                        <Icon
                            raised //reverse
                            size={14}
                            name='facebook'
                            type='font-awesome'
                            color={navbar_clr}
                            containerStyle={{ marginHorizontal: 0, marginRight: 5 }}
                            onPress={() => this.social_service(data.social_links.fb)}
                            underlayColor='rgba(255,0,0,0.3)'
                        />
                        <Icon
                            raised //reverse
                            size={14}
                            name='twitter'
                            type='entypo'
                            color={navbar_clr}
                            // containerStyle={{ marginHorizontal: 0 }}
                            onPress={() => this.social_service(data.social_links.twitter)}
                            underlayColor='rgba(255,0,0,0.3)'
                        />
                        <Icon
                            raised //reverse
                            size={14}
                            name='google-'
                            type='entypo'
                            color={navbar_clr}
                            // containerStyle={{ marginHorizontal: 0 }}
                            onPress={() => this.social_service(data.social_links.google)}
                            underlayColor='rgba(255,0,0,0.3)'
                        />
                        <Icon
                            raised //reverse
                            size={14}
                            name='linkedin'
                            type='entypo'
                            color={navbar_clr}
                            // containerStyle={{ marginHorizontal: 0 }}
                            onPress={() => this.social_service(data.social_links.linkedin)}
                            underlayColor='rgba(255,0,0,0.3)'
                        />
                    </View>
                </View>
                {
                    data.user_loc.length > 0 ?

                        <View style={{ height: height(7), width: width(90), marginRight: 0, alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 0.4, flexDirection: 'row', alignSelf: 'center' }}>
                            <Icon
                                reverse //raised
                                size={14}
                                name='address'
                                type='entypo'
                                color='#f50'
                                iconStyle={{ color: 'white' }}
                                containerStyle={{ marginLeft: 0 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: totalSize(1.8), marginHorizontal: 5, color: COLOR_SECONDARY }}>{data.user_loc}</Text>
                        </View>
                        : null
                }
                {
                    data.user_contact.length > 0 ?
                        <View style={{ height: height(7), width: width(90), marginRight: 0, alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 0.4, flexDirection: 'row', alignSelf: 'center' }}>
                            <Icon
                                reverse //raised
                                size={14}
                                name='phone'
                                type='FontAwesome'
                                color='#f50'
                                iconStyle={{ color: 'white' }}
                                containerStyle={{ marginLeft: 0 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: totalSize(1.8), marginHorizontal: 5, color: COLOR_SECONDARY }}>{data.user_contact}</Text>
                        </View>
                        : null
                }
                {
                    data.user_email ?
                        <View style={{ height: height(7), width: width(90), marginRight: 0, alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 0.4, flexDirection: 'row', alignSelf: 'center' }}>
                            <Icon
                                reverse //raised
                                size={14}
                                name='email'
                                type='Zocial'
                                color='#f50'
                                iconStyle={{ color: 'white' }}
                                containerStyle={{ marginLeft: 0 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: totalSize(1.8), marginHorizontal: 5, color: COLOR_SECONDARY }}>{data.user_email}</Text>
                        </View>
                        : null
                }
                {
                    data.about.length ?
                        <TouchableOpacity style={{ height: height(7), width: width(90), marginRight: 0, alignItems: 'center', borderBottomColor: '#ccc', borderBottomWidth: 0.4, flexDirection: 'row', alignSelf: 'center' }} onPress={() => { this.setState({ is_about: !this.state.is_about }) }}>
                            <Icon
                                reverse //raised
                                size={14}
                                name='ios-people'
                                type='ionicon'
                                color='#f50'
                                iconStyle={{ color: 'white' }}
                                containerStyle={{ marginLeft: 0 }}
                            />
                            <Text style={{ fontWeight: 'bold', fontSize: totalSize(1.8), marginHorizontal: 5, color: COLOR_SECONDARY }}>{data.about}</Text>
                        </TouchableOpacity>
                        : null
                }
                {
                    this.state.is_about ?
                        <View style={{ width: width(85), alignSelf: 'flex-end', backgroundColor: COLOR_PRIMARY }}>
                            <Text style={{ marginHorizontal: 10, marginBottom: 10 }}>{data.about_desc}</Text>
                        </View>
                        :
                        null
                }
            </View>
        );
    }
}