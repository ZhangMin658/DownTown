import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { width, height } from 'react-native-dimension';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';
import { withNavigation } from 'react-navigation';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Home';
import { Icon, Avatar } from 'react-native-elements';

class EventComponent extends Component<Props> {
    render() {
        let item = this.props.item;
        return (
            <TouchableOpacity style={styles.cateCon} onPress={() => this.props.navigation.push('EventDetail', { event_id: item.event_id, headerColor: store.settings.data.navbar_clr, title: item.event_title })} >
                <Image style={styles.cate_img} source={{ uri: item.image }} />
                <ImageBackground style={[styles.cate_img, { position: 'absolute' }]} source={require('../../images/cate-shadow.png')} />
                <View style={[styles.cate_img, { position: 'absolute' }]}>
                    <View style={{ flex: 1, alignItems: 'flex-end', borderRadius: 5 }}>
                        <View style={styles.cate_name}>
                            <Text style={styles.cateNameText}>{item.event_category_name}</Text>
                        </View>
                    </View>
                    <View style={{ height: height(15), borderRadius: 5, justifyContent: 'center' }}>
                        <View style={{ flexDirection: 'row', marginHorizontal: 10 }}>
                            <Text style={styles.cate_text}>{item.event_start_date}  -</Text>
                            <Text style={styles.cate_text}>{item.event_end_date}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-start' }}>
                            <Text style={styles.eventTitle}>{item.event_title}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginHorizontal: 7,marginTop:3,alignContent:'center',alignItems:'center' }}>

                            <Icon
                                size={16}
                                name='location'
                                type='evilicon'
                                color='#fff'
                                containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                            />
                            {/* <ImageBackground style={styles.locIcon} source={require('../../images/paper-plane.png')} /> */}
                            <Text style={[styles.locText,{marginLeft:5}]}>{item.event_loc}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
export default withNavigation(EventComponent)
