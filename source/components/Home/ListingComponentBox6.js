  
import React, { Component } from 'react';
import { Text, View, Image, ImageBackground, I18nManager, TouchableOpacity } from 'react-native';
// import ProgressBar from 'react-native-progress/Bar';
import ProgressImage from '../CustomTags/ImageTag';
import { width, height } from 'react-native-dimension';
import { Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { COLOR_GRAY, COLOR_ORANGE } from '../../../styles/common';
import { withNavigation } from 'react-navigation';
import styles from '../../../styles/Home6';
import store from '../../Stores/orderStore';
import { widthPercentageToDP as wp } from '../../helpers/Responsive';
class ListingComponentBox extends Component<Props> {
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
            <TouchableOpacity style={[styles.featuredFLItemBox, { width: status ? wp(45) : wp(45) }]} onPress={() => { store.LIST_ID = item.listing_id, this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
                <View style={{
                    height: wp(40),
                    width: wp(44),
                    borderRadius: wp('2'),
                    // marginLeft: 1,
                    marginTop: wp(0.5),
                    // backgroundColor: 'red',
                    alignSelf: "center",
                    overflow: "hidden",

                }}>
                    <ProgressImage indicator={null} source={{ uri: item.image }} style={styles.featuredImg}>
                        <TouchableOpacity style={[styles.closedBtn, { backgroundColor: item.color_code }]}>
                            <Text style={styles.closedBtnTxt}>{item.business_hours_status}</Text>
                        </TouchableOpacity>
                    </ProgressImage>

                </View>
                {
                    I18nManager.isRTL ? [
                        <Image
                            source={require('../../images/left-star.png')}
                            style={{ height: wp('8'), width: wp('8'), position: 'absolute', right: 0 }}
                        />
                    ] : [
                            <Image
                                source={require('../../images/right_Star.png')}
                                style={{ height: wp('8'), width: wp('8'), position: 'absolute', right: 0 }}
                            />
                        ]
                }


                <View style={styles.txtViewConBox}>
                    <View style={{ marginTop: wp('1'), width: wp(40), marginHorizontal: 7, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            size={18}
                            name='calendar'
                            type='evilicon'
                            color='red'
                            containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                        />
                        <Text style={{ fontSize: 10, color: '#8a8a8a', marginLeft: 2 }}>{item.posted_date}</Text>
                    </View>



                    <View style={{ width: wp(40), alignItems: 'flex-start' }}>
                        <Text style={styles.txtViewHeadingBox}>{item.listing_title}</Text>
                    </View>


                    {/* <View style={styles.ratingCon}>
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
                        <Icon
                            size={20}
                            name='eye'
                            type='evilicon'
                            color='#8a8a8a'
                            containerStyle={{ marginLeft: 0, marginVertical: 3 }}
                        />
                        <Text style={styles.ratingTxt}>{item.total_views}</Text>
                    </View> */}
                   {
                       item.listing_location!=null?[
                        <View style={{ marginTop: 5, width: width(45), marginHorizontal: 6, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            size={18}
                            name='location'
                            type='evilicon'
                            color='red'
                            containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                        />
    <Text style={{ fontSize: 10, color: '#8a8a8a', marginLeft: 2, }}>{item.listing_location}</Text>
                    </View>
                       ]:[]
                   }
                 

                </View>
            </TouchableOpacity>
        );
    }
}
export default withNavigation(ListingComponentBox)