import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity , Linking} from 'react-native';
// import ProgressBar from 'react-native-progress/Bar';
import ProgressImage from '../CustomTags/ImageTag';
import { width } from 'react-native-dimension';
import { Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { COLOR_GRAY, COLOR_ORANGE } from '../../../styles/common';
import { withNavigation } from 'react-navigation';
import styles from '../../../styles/Home';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import ApiController from '../../ApiController/ApiController';
import call from 'react-native-phone-call';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Toast from 'react-native-simple-toast'

class ListingComponent extends Component<Props> {
    constructor (props) 
    {
        super(props);
        this.props = props;
        this.state ={
            loading: true,
            item : this.props.item,
            isFavorite : this.props.item.isFavorite,
            phoneNum : '',
            whatsapp : '',
            featured_txt: ''
        };
    }

    UNSAFE_componentWillReceiveProps = (props) =>{
        this.props = props;
        this.setState({item : this.props.item, isFavorite : this.props.item.isFavorite,});
    }
    
    UNSAFE_componentWillMount = async () => {
        let item = this.state.item;
        try {
            //this.setState({ loading: true })
            //API calling
            let parameter = {
            listing_id: item.listing_id    // params.listId
            }
            let response = await ApiController.post('listing-detial', parameter);
        //   console.log('listing details=====>>>>',response);
            if (response.success === true) {
                this.setState({
                    loading: false,
                    phoneNum : response.data.listing_detial.contact_no,
                    whatsapp :response.data.listing_detial.web_url,
                    featured_txt : item.is_featured == "1" ? response.data.listing_detial.featured_txt :  "",
                })
            
            } else {
                this.setState({ loading: false })
            }
        } catch (error) {
            this.setState({ loading: false })
            // console.warn('error', error);
        }
    }

    call = (number) => {
        const args = {
            number: number, // String value with the number to call
            prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
        }
        call(args).catch(console.error)
    }

    bookMarkedListing = async () => {
        let item = this.state.item;
        let { orderStore } = Store;
        if (orderStore.settings.data.is_demo_mode) {
            Toast.show(orderStore.settings.data.demo_mode_txt)
        } else {
            let params = {
                listing_id: item.listing_id 
            }
            response = await ApiController.post('listing-bookmark', params);
            if (response.success) {
                this.setState({ isFavorite: true })
                Toast.show(response.message)
            } else {
                Toast.show(response.message)
            }
        }
    }

    deleteListings = async () => {
        try {
            let params = {
            listing_id: this.state.item.listing_id
            }
            //API calling
            let response = await ApiController.post('remove-favz', params);
            // console.log(params);
            // console.log(response);
            if (response.success) {
            this.setState({ isFavorite: false })
            }
        } catch (error) {
            console.log('error', error);
        }
    }

    whatsappLink = (link) => {
        if(link == null || link == '') return;
        if(link.includes("https://wa.me/") == true)
        {
            Linking.openURL(link);
        }
        else
        {
            Linking.openURL("https://wa.me/" + link);
        }
    }

    onStarRatingPress(rating) {
        this.setState({
            //   starCount: rating
        });
    }
    render() {
        let item = this.state.item;
        // console.log(item)
        let status = this.props.listStatus;
        let curLoc = ((store.CUR_CITY.name == null) || (store.CUR_CITY.name == 'select city')) ? '' :  store.CUR_CITY.name; 
        if((store.CUR_CITY.name == null) || (store.CUR_CITY.name == 'select city'))
        {
            curLoc = item.listing_location;
        }  

        return (
            <TouchableOpacity style={[styles.featuredFLItem, { width: status ? width(95) : width(90)}, {backgroundColor:  item.is_featured == '1' ? COLOR_GRAY : '#ffffff'}]} onPress={() => { store.LIST_ID = item.listing_id, this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
                <View style={{
                    height: 99,
                    width: width(25),
                    borderRadius: 15,
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
                        <Text style={{ fontSize: 10, color: '#8a8a8a', marginLeft: 2 }}>{this.state.featured_txt}</Text>
                    </View>

                    <View style={{ width: width(50), alignItems: 'flex-start' }}>
                        <Text style={styles.txtViewHeading}>{item.listing_title}</Text>
                    </View>

                    <View style={{ width: width(50), flexDirection: 'row', marginTop: 2 }}>
                        {
                            item.category_name != null && item.category_name != "" ?
                                <Text style={styles.subHeadingTxt}>{item.category_name}</Text>
                                : null
                        }
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
                        [
                            <View style={{ marginTop: 5, width: width(45), marginHorizontal: 6, flexDirection: 'row', alignItems: 'center' }}>
                                <Icon
                                    size={18}
                                    name='location'
                                    type='evilicon'
                                    color='red'
                                    containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                                />
                                <Text style={{ fontSize: 10, color: '#8a8a8a', marginLeft: 2, }}>{curLoc}</Text>
                                <Icon
                                    size={18}
                                    name='eye'
                                    type='evilicon'
                                    color='#8a8a8a'
                                    containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                                />
                                <Text style={{ fontSize: 10, color: '#8a8a8a' }}>{item.total_views} visitas</Text>

                            </View>
                            
                        ]
                    }
                </View>
                <View style = {{width : width(13), paddingBottom : 5, flex : 1, flexDirection : 'column', justifyContent : 'flex-end', alignItems : 'center'}}>
                    <TouchableOpacity onPress = {this.state.isFavorite == true ? this.deleteListings : this.bookMarkedListing}>
                        <AntDesign name = { this.state.isFavorite == true ? "heart" : "hearto"} size = {26} 
                            style = {{color : "#ff0000"}} 
                            />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.call(this.state.phoneNum)}>
                        <MaterialIcons name = "phone-in-talk" size = {26} style = {{color : "#232323"}}  />
                    </TouchableOpacity>
                    <TouchableOpacity onPress = {() => this.whatsappLink(this.state.whatsapp)}>
                        <Ionicons name = "logo-whatsapp" size = {26} style = {{color : "#33ee00"}} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }
}
export default withNavigation(ListingComponent)
