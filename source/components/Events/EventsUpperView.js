import React, {Component} from 'react';
import {Platform, Text, View, Linking } from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { Avatar, Icon } from 'react-native-elements';
import { COLOR_PRIMARY,COLOR_SECONDARY,COLOR_GRAY } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
@observer
export default class UpperView extends Component<Props> {
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
    let data = store.MY_EVENTS.data.profile_data;    
    return (
        <View style={{ width: width(100), marginBottom: 0, backgroundColor: COLOR_PRIMARY, borderBottomWidth: 0.4, borderBottomColor: '#ccc' }}>
         {
           data === ""?
             null
             :
             <View style={{ alignItems:'center' }}>
                <Avatar
                    large
                    rounded
                    source={{ uri: data.profile_img }}
                    activeOpacity={1}
                    containerStyle={{ marginHorizontal: 20, marginTop: 15 }}
                />
                <Text style={{ fontSize: totalSize(2.5), fontWeight: 'bold', color: COLOR_SECONDARY, marginHorizontal: 0 }}>{data.name}</Text>
                <View style={{ height: height(7), flexDirection: 'row',marginVertical: 5, marginHorizontal: 20 }}>
                    <Icon
                        raised //reverse
                        size={14}
                        name='facebook'
                        type='font-awesome'
                        color={navbar_clr}
                        containerStyle={{ marginHorizontal: 0, marginRight: 5 }}
                        onPress={() => this.social_service(data.fb_link)}
                        underlayColor='rgba(255,0,0,0.3)'
                    />
                    <Icon
                        raised //reverse
                        size={14}
                        name='twitter'
                        type='entypo'
                        color={navbar_clr}
                        // containerStyle={{ marginHorizontal: 0 }}
                        onPress={() => this.social_service(data.twitter_link)}
                        underlayColor='rgba(255,0,0,0.3)'
                    />
                    <Icon
                        raised //reverse
                        size={14}
                        name='google-'
                        type='entypo'
                        color={navbar_clr}
                        // containerStyle={{ marginHorizontal: 0 }}
                        onPress={() => this.social_service(data.google_link)}
                        underlayColor='rgba(255,0,0,0.3)'
                    />
                    <Icon
                        raised //reverse
                        size={14}
                        name='linkedin'
                        type='entypo'
                        color={navbar_clr}
                        // containerStyle={{ marginHorizontal: 0 }}
                        onPress={() => this.social_service(data.linkedin_link)}
                        underlayColor='rgba(255,0,0,0.3)'
                    />
                </View>
            </View> 
         }
        </View>
    );
}
}
