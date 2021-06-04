import React, { Component } from 'react';
import { Platform, Text, View, ActivityIndicator, Image, ImageBackground, TouchableOpacity } from 'react-native';
import { COLOR_RED, COLOR_ORANGE } from '../../../styles/common';
import {
  AdMobBanner,
  AdMobInterstitial,
  PublisherBanner,
  AdMobRewarded,
} from 'react-native-admob';
import { width } from 'react-native-dimension';
import * as Animatable from 'react-native-animatable';
import Form from 'react-native-vector-icons/AntDesign'
import StarRating from 'react-native-star-rating';
import Toast from 'react-native-simple-toast'
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import ApiController from '../../ApiController/ApiController';
import styles from '../../../styles/FeatureDetailStyle';
import { withNavigation } from 'react-navigation';

class FeatureDetail extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    }
  }
  static navigationOptions = {
    header: null,
  };
  bookMarkedListing = async () => {
    let { orderStore } = Store;
    if (orderStore.settings.data.is_demo_mode) {
      Toast.show(orderStore.settings.data.demo_mode_txt)
    } else {
      this.setState({ loading: true })
      let params = {
        listing_id: orderStore.home.LIST_ID
      }
      response = await ApiController.post('listing-bookmark', params);
      console.log('book mark listing====>>>',response);
      if (response.success) {
        this.setState({ loading: false })
        Toast.show(response.message);
      } else {
        this.setState({ loading: false })
        Toast.show(response.message)
      }
    }
  }
  render() {
    let { orderStore } = Store;
    let data = orderStore.home.FEATURE_DETAIL.data.listing_detial;
    let setting = store.settings.data;
    return (
      <View style={{ alignItems:'center' }}>
        {
          setting.has_admob && setting.admob.banner !== '' ?
            <AdMobBanner
              adSize={Platform.OS === 'ios' ? "smartBanner" : "smartBannerLandscape"}
              adUnitID={setting.admob.banner} // 'ca-app-pub-3940256099942544/6300978111' 
              onAdFailedToLoad={async () => await this.setState({ loadAdd: false })}
              didFailToReceiveAdWithError={async () => await this.setState({ loadAdd: false })}
              onAdLoaded={async () => { await this.setState({ loadAdd: true }) }}
            />
            :
            null
        }
        <ImageBackground source={{ uri: data.first_img }} style={styles.bgImg}>
          <View style={styles.imgConView}>
            <View style = {{flex : 1, padding : 5, width : width(100), alignItems:'flex-end'}}>
              {
                data.is_claim == true ? <Image source={require('../../images/verified.png')} style={{width : 45, height : 45}} /> : null
              }
            </View>
            <View style={styles.imgSubConView}>
              {
                data.is_featured === '0' ?
                  null
                  :
                  <Animatable.View
                    // duration={2000}
                    // animation="tada"
                    // easing="ease-out"
                    // iterationCount={'infinite'}
                    // direction="alternate"
                    style={styles.featureBtn}>
                    <Text style={styles.featureBtnTxt}>{data.featured_txt}</Text>
                  </Animatable.View>
              }
              <View style={{ width: width(90), justifyContent: 'center', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                <Text style={styles.title}>{data.listing_title}</Text>
              </View>
              <View style={styles.dateRatingCon}>
                <Text style={styles.date}>{data.posted_date}</Text>
                <View style={styles.gradingCon}>
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    starSize={13}
                    fullStarColor={COLOR_ORANGE}
                    containerStyle={{ marginHorizontal: 10 }}
                    rating={data.ratings.rating_stars === "" ? 0 : data.ratings.rating_stars}
                  />
                </View>
                <Text style={styles.rateTxt}>{data.ratings.rating_avg}</Text>
                <Form name='eyeo' size={18} color='white' style = {{marginLeft : 7}} />
                <Text style={{color : 'white', fontSize : 12}}> {data.total_views} visitas</Text>
              </View>
              <View style={styles.btnSaveReport}>
                {
                  data.is_saved ?
                    <TouchableOpacity style={styles.btn} onPress={this.bookMarkedListing}>
                      <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                        {
                          this.state.loading ?
                            <ActivityIndicator size='small' color={COLOR_RED} animating={true} />
                            :
                            <Animatable.View
                              duration={1000}
                              animation="pulse"
                              easing="ease-out"
                              iterationCount={'infinite'}
                              direction="alternate">
                              <Image source={require('../../images/love.png')} style={styles.btnIcon} />
                            </Animatable.View>
                        }
                        <Text style={styles.saveBtnTxt}>{data.save_listing}</Text>
                      </View>
                    </TouchableOpacity>
                    :
                    null
                }
                {
                  data.is_report ?
                    <TouchableOpacity style={styles.btn} onPress={() => { this.props.callModel('report', true) }}>
                      <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                        <Animatable.View
                          duration={1000}
                          animation="jello"
                          easing="ease-out"
                          iterationCount={'infinite'}
                          direction="alternate">
                          <Image source={require('../../images/warning.png')} style={styles.btnIcon} />
                        </Animatable.View>
                        <Text style={styles.repBtnTxt}>{data.report_listing}</Text>
                      </View>
                    </TouchableOpacity>
                    :
                    null
                }
                {
                  data.is_claim ?
                    <TouchableOpacity style={styles.btn} onPress={() => { this.props.callModel('claim', false) }}>
                      <View style={{ flexDirection: 'row', marginHorizontal: 5 }}>
                        <Animatable.View
                          duration={2000}
                          animation="tada"
                          easing="ease-out"
                          iterationCount={'infinite'}
                          direction="alternate">
                          <Image source={require('../../images/shield.png')} style={styles.btnIcon} />
                        </Animatable.View>
                        <Text style={styles.repBtnTxt}>{data.claim_listing}</Text>
                      </View>
                    </TouchableOpacity>
                    :
                    null
                }
                {
                  data.is_listing_owner ?
                    <TouchableOpacity style={{ marginLeft: Platform.OS === 'ios' ? width(20) : width(26), alignItems: 'flex-end' }} onPress={() => { this.props.navigation.push('ListingPostTabCon', { list_id: data.listing_id }), store.LISTING_UPDATE = true }}>
                      <Animatable.View
                        duration={2000}
                        animation="tada"
                        easing="ease-out"
                        iterationCount={'infinite'}
                        direction="alternate">
                        <Form name='form' size={24} color='white' />
                      </Animatable.View>
                    </TouchableOpacity>
                    :
                    null
                }
              </View>
            </View>
          </View>
        </ImageBackground>
      </View>
    );
  }
}

export default withNavigation(FeatureDetail)