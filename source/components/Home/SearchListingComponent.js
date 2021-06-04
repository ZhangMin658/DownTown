import React, { Component } from 'react';
import { Text, View, I18nManager,ImageBackground, TouchableOpacity, Image } from 'react-native';
import { width } from 'react-native-dimension';
import { Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { COLOR_GRAY, COLOR_ORANGE } from '../../../styles/common';
import { withNavigation } from 'react-navigation';
import styles from '../../../styles/SearchListingStyle';
import {widthPercentageToDP as wp} from '../../helpers/Responsive'
class ListingComponent extends Component<Props> {
    onStarRatingPress(rating) {
        this.setState({
            //   starCount: rating
        });
    }
    render() {
        let item = this.props.item;
        let status = this.props.listStatus;
        // console.log('iamge uri==>>',item.image);

        return (
            <TouchableOpacity style={[styles.featuredFLItem, {backgroundColor:  item.is_featured == '1' ? COLOR_GRAY : '#ffffff'}, { width: status ? width(95) : width(90) }]} onPress={() => { this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
                <ImageBackground source={{ uri: item.image }} style={styles.featuredImg}>
                    <TouchableOpacity style={[styles.closedBtn, { backgroundColor: item.color_code }]}>
                        <Text style={styles.closedBtnTxt}>{item.business_hours_status}</Text>
                    </TouchableOpacity>
                </ImageBackground>
                {
                    item.is_featured == '1' ?
                        <Image
                            style={{height:wp('9'),width:wp('9'), position: 'absolute', right: wp(0), }}
                            resizeMode="contain"
                            source={
                                I18nManager.isRTL?require('../../images/left-star.png'):
                                require('../../images/right_Star.png')}

                        /> : null
                }

                <View style={styles.txtViewCon}>
                    <Text style={styles.subHeadingTxt}>{item.category_name}</Text>
                    <Text style={styles.txtViewHeading}>{item.listing_title}</Text>
                    <View style={styles.ratingCon}>
                        <View style={styles.gradingCon}>
                            <StarRating
                                disabled={false}
                                maxStars={5}
                                starSize={13}
                                fullStarColor={COLOR_ORANGE}
                                containerStyle={{ marginHorizontal: 10 }}
                                rating={item.rating_stars == null ? 0 : item.rating_stars.length === 0 ? 0 : item.rating_stars}
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
export default withNavigation(ListingComponent)