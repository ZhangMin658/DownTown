import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
import { width } from 'react-native-dimension';
import { Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { COLOR_GRAY, COLOR_ORANGE } from '../../../styles/common';
import { withNavigation } from 'react-navigation';
import store from '../../Stores/orderStore';
import styles from '../../../styles/HomeOld';
class ListingComp extends Component<Props> {
    onStarRatingPress(rating) {
        this.setState({
            //   starCount: rating
        });
    }
    render() {
        let item = this.props.item;
        let status = this.props.listStatus;
        let navbar_clr = store.settings.data.main_clr;
        return (
            <TouchableOpacity style={[styles.featuredFLItem, { width: status ? width(95) : width(90) }]} onPress={() => { this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
                <ImageBackground source={{ uri: item.image }} style={styles.featuredImg}>
                    <TouchableOpacity style={[styles.closedBtn, { backgroundColor: item.color_code }]}>
                        <Text style={styles.closedBtnTxt}>{item.business_hours_status}</Text>
                    </TouchableOpacity>
                </ImageBackground>
                <View style={styles.txtViewCon}>
                    <View style={{ flexDirection: 'row', alignItems:'center' }}>
                        <Text style={styles.subHeadingTxt}>{item.category_name}</Text>
                        <TouchableOpacity style={{ height: 25, width: 25, backgroundColor:'red',justifyContent:'center',alignItems:'center',borderRadius: 100 }} onPress={()=>this.props._deleteListing(item.listing_id)}>
                            <Text style={{ color: 'white', fontSize: 13 }}>X</Text>
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.txtViewHeading}>{item.listing_title}</Text>
                    <View style={styles.ratingCon}>
                        <View style={styles.gradingCon}>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                starSize={13}
                                fullStarColor={COLOR_ORANGE}
                                containerStyle={{ marginHorizontal: 10 }}
                                rating={item.rating_stars === "" ? 0 : item.rating_stars}
                            />
                        </View>
                        {/* <Icon
                            size={20}
                            name='eye'
                            type='evilicon'
                            color='#8a8a8a'
                            containerStyle={{ marginLeft: 0, marginVertical: 3 }}
                        />
                        <Text style={styles.ratingTxt}>{item.total_views}</Text> */}
                    </View>
                    <View style={{ marginTop: 2, width: width(45), marginHorizontal: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            size={18}
                            name='calendar'
                            type='evilicon'
                            color='#8a8a8a'
                            containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                        />
                        <Text style={{ fontSize: 10, color: '#8a8a8a' }}>{item.posted_date}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
export default withNavigation(ListingComp)
