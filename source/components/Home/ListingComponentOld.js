import React, { Component } from 'react';
import { Text, View, ImageBackground, TouchableOpacity } from 'react-native';
// import ProgressBar from 'react-native-progress/Bar';
import ProgressImage from '../CustomTags/ImageTag';
import { width } from 'react-native-dimension';
import { Icon } from 'react-native-elements';
import StarRating from 'react-native-star-rating';
import { COLOR_GRAY, COLOR_ORANGE } from '../../../styles/common';
import { withNavigation } from 'react-navigation';
import styles from '../../../styles/HomeOld';
import store from '../../Stores/orderStore';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ApiController from '../../ApiController/ApiController';
import call from 'react-native-phone-call';

class ListingComponent extends Component{
    constructor (props) 
    {
        super(props);
        this.props = props;
        this.state ={
            loading: true,
            isFavorite : false,
            phoneNum : '',
            whatsapp : ''
        };
    }

    
  componentWillMount = async () => {
    let item = this.props.item;
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
              isFavorite : response.data.listing_detial.is_saved,
              phoneNum : response.data.listing_detial.contact_no,
              whatsapp :response.data.listing_detial.contact_no,
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

    onStarRatingPress(rating) {
  
    }
    render() {
       
        let item = this.props.item;
        let status = this.props.listStatus;
        let curLoc = (store.CUR_CITY.name == null? '' : store.CUR_CITY.name) 
        if(store.CUR_CITY.name == null)
        {
            curLoc = item.listing_location;
        }   
        // console.log('iamge uri==>>',item.image);
        // console.log(item.listing_location)
        return (
            <TouchableOpacity style={[styles.featuredFLItem,{ width: status? width(95) : width(90) }]} onPress={() => { store.LIST_ID=item.listing_id, this.props.navigation.navigate('FeatureDetailTabBar', { listId: item.listing_id, list_title: item.listing_title }) }}>
                <ProgressImage indicator={null} source={{ uri: item.image }} style={styles.featuredImg}>
                    <TouchableOpacity style={[styles.closedBtn, { backgroundColor: item.color_code }]}>
                        <Text style={styles.closedBtnTxt}>{item.business_hours_status}</Text>
                    </TouchableOpacity>
                </ProgressImage>
                <View style={styles.txtViewCon}>
                    <View style={{ width: width(50), alignItems:'flex-start' }}>
                        <Text style={styles.subHeadingTxt}>{item.category_name}</Text>
                    </View>
                    <View style={{ width: width(50), alignItems:'flex-start' }}>
                        <Text style={styles.txtViewHeading}>{item.listing_title}</Text>
                    </View>
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
                    <View style={{ marginTop: 2, width: width(45), marginHorizontal: 8, flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ fontSize: 12, color: '#8a8a8a', marginRight : 5 }}>{curLoc}</Text>
                        <Icon
                            size={18}
                            name='eye'
                            type='evilicon'
                            color='#8a8a8a'
                            containerStyle={{ marginHorizontal: 0, marginVertical: 0 }}
                        />
                        <Text style={{ fontSize: 10, color: '#8a8a8a' }}>{item.total_views} visitas</Text>
                    </View>
                </View>
                <View style = {{padding: 5, flex : 1, flexDirection : 'column', justifyContent : 'flex-end', alignItems : 'center'}}>
                    <AntDesign name = { this.state.isFavorite == true ? "heart" : "hearto"} size = {26} style = {{color : "#ff0000"}} onPress = {() => {}}/>
                    <MaterialIcons name = "phone-in-talk" size = {26} style = {{color : "#232323"}}  onPress={() => this.call(this.state.phoneNum)}/>
                    <Ionicons name = "logo-whatsapp" size = {26} style = {{color : "#33ee00"}}/>
                </View>
            </TouchableOpacity>
        );
    }
}
export default withNavigation(ListingComponent)