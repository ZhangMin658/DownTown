import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
// import ProgressBar from 'react-native-progress/Bar';
import ProgressImage from '../CustomTags/ImageTag';
import { width } from 'react-native-dimension';
import { Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { COLOR_GRAY, COLOR_ORANGE } from '../../../styles/common';
import { withNavigation } from 'react-navigation';
import styles from '../../../styles/Home5';
import store from '../../Stores/orderStore';
import { widthPercentageToDP as wp } from '../../helpers/Responsive';
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
            <TouchableOpacity style={[styles.featuredFLItem, { width: status ? width(95) : width(90) }]} onPress={() => { store.LIST_ID = item.listing_id, this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
                <View style={{
                    height: 99,
                    width: width(26),
                    borderTopRightRadius: wp('5'),
                    borderBottomLeftRadius: wp('5'),

                    marginLeft: 1,
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

                <View style={styles.txtViewCon}>
                    <View style={{ marginTop: 0, width: width(45), marginHorizontal: 7, flexDirection: 'row', alignItems: 'center' }}>
                        <Icon
                            size={18}
                            name='calendar'
                            type='evilicon'
                            color='red'
                            containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                        />
                        <Text style={{ fontSize: 10, color: '#8a8a8a', marginLeft: 2 }}>{item.posted_date}</Text>
                    </View>



                    <View style={{ width: width(50), alignItems: 'flex-start' }}>
                        <Text style={styles.txtViewHeading}>{item.listing_title}</Text>
                    </View>

                    {/* <View style={{ width: width(50),flexDirection:'row',marginTop:2 }}>
                        <Text style={styles.subHeadingTxt}>2 Reviews  |</Text>
                        <Text style={styles.subHeadingTxt}>{item.category_name}    |</Text>
                        <Text style={styles.subHeadingTxt}>{item.business_hours_status}</Text>
                    </View> */}

                    <View style={[styles.ratingCon]}>
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
                    <View style={{ marginTop: wp('2'), width: '100%', borderTopWidth: wp(0.1), borderTopColor: '#D8D8D8', flexDirection: 'row', alignItems: 'center', alignContent: 'center' }}>
                        <Icon
                            size={18}
                            name='location'
                            type='evilicon'
                            color='red'
                            containerStyle={{ marginHorizontal: 0, marginVertical: 0, marginTop: wp('2'), marginLeft: wp('2') }}
                        />
                        {
                            item.listing_location != null ? [
                                <Text style={{ fontSize: 10, color: '#8a8a8a', marginLeft: 2, marginTop: wp('2') }}>{item.listing_location}</Text>
                            ] : []
                        }

                        <Text style={{ fontSize: 10, color: '#8a8a8a', marginLeft: 2, marginTop: wp('2'), position: 'absolute', right: wp('2'), top: wp('0') }}>{item.business_hours_status}</Text>

                    </View>

                </View>
            </TouchableOpacity>
        );
    }
}
export default withNavigation(ListingComponent)