import React, { Component } from 'react';
import {
  Platform, Text, View, ActivityIndicator, Image, ImageBackground, TouchableOpacity, ScrollView, TextInput
} from 'react-native';
import { Avatar } from 'react-native-elements';
import Toast from 'react-native-simple-toast';
import { width, height, totalSize } from 'react-native-dimension';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
import HTMLView from 'react-native-htmlview';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_PINK } from '../../../styles/common';
import StarRating from 'react-native-star-rating';
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Reviews/ReceiveReviewsStyleSheet';
import { withNavigation } from 'react-navigation';
import UpperView from './UpperView';
const buttonTxt = 1.8;
const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;
const headingTxt = 1.6;
const smallButtons = 1.2;
const titles = 1.8;
class ReceiveReview extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      activities: [],
      postComment: false,
      loadMore: false,
      reCaller: false,
      comment: ''
    }
  }
  static navigationOptions = { header: null };
  loadMore = async (listType, pageNo) => {
    this.setState({ loadMore: true })
    let params = {
      review_type: listType,
      next_page: pageNo
    }
    let data = store.USER_REVIEWS.data.received_reviews;
    let response = await ApiController.post('my-own-reviews', params);
    // console.log('Tabs loadMore=====>>>', response);
    if (response.has_comments && data.received_pagination.has_next_page) {
      // forEach Loop LoadMore results
      response.commnets.forEach((item) => {
        item.added = false;
        item.checked = false;
        item.is_Active = false;
        data.commnets.push(item);
      })
      data.received_pagination = response.received_pagination;
      // console.log('after Loop=======>>>',data.commnets);        
      await this.setState({ loadMore: false })
    } else {
      await this.setState({ loadMore: false })
      // Toast.show(response.data.no_more)
    }
    await this.setState({ reCaller: false })
  }
  headerCollapse = async (section) => {
    store.USER_REVIEWS.data.received_reviews.commnets.forEach((item) => {
      if (item.comment_id === section.comment_id && item.is_Active === false) {
        item.is_Active = !section.is_Active;
        if (section.has_reply) {
          this.setState({ comment: section.replier_msg })
        }
      } else {
        item.is_Active = false;
        item.checked = false;
        item.added = false;
      }
      this.setState({ name: '' })
    })
  }
  postComment = async (section) => {
    this.setState({ postComment: true })
    let params = {
      listing_id: section.listing_id,
      comment_id: section.comment_id,
      comment: this.state.comment,
      replyed_comment_id: section.has_reply ? section.reply_comment_id : ''
    }
    try {
      let response = await ApiController.post('received-reviews', params);
      if (response.success) {
        Toast.show(response.message);
        //Refresh reviews completely
        let res = await ApiController.get('reviews');
        store.USER_REVIEWS = res;
        //////
        this.setState({ postComment: false })
      } else {
        Toast.show(response.message);
        this.setState({ postComment: false })
      }
    } catch (error) {
      console.log('error==>>', error);
      this.setState({ postComment: false })
    }
  }
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  _renderHeader = (section, index, isActive) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={{ flex: 1, flexDirection: 'row', borderRadius: 5, marginVertical: 10, marginHorizontal: 15, borderBottomWidth: 0.4, borderColor: (isActive ? "#f9f9f9" : COLOR_GRAY) }} onPress={async () => {
          await this.headerCollapse(section)
        }}>
          <View style={{ height: height(10), alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 10 }}>
            <Avatar
              medium
              rounded
              source={{ uri: section.commenter_dp }}
              activeOpacity={1}
              onPress={() => this.props.navigation.push('PublicProfileTab', { profiler_id: section.user_id, user_name: section.commenter_name })}
            />
          </View>
          <View style={{ flex: 2, marginHorizontal: 10, justifyContent: 'flex-start', marginBottom: 10, }}>
            <Text style={{ fontSize: totalSize(subHeadingTxt), textAlign:'left',fontWeight: 'bold', color: COLOR_SECONDARY }}>{section.commenter_name}</Text>
            <View style={{ alignSelf: 'flex-start', width: 280, flexDirection: 'row', flexWrap: 'wrap' }}>
              <Text style={{ fontSize: 11, marginRight: 5, color: Platform.OS === 'ios' ? 'gray' : null }}>{section.statement}</Text>
              <Text
                style={{ fontSize: totalSize(subHeadingTxt), fontWeight: 'bold', color: COLOR_SECONDARY }}
                onPress={() => this.props.navigation.navigate('FeatureDetailTabBar', { listId: section.listing_id, list_title: section.listing_title })}
              >{section.listing_title}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginVertical: 2 }}>
              <StarRating
                disabled={false}
                maxStars={5}
                starSize={13}
                fullStarColor={COLOR_ORANGE}
                containerStyle={{ marginRight: 5 }}
                rating={section.rating_stars.length === 0 ? 0 : parseInt(section.rating_stars)}
              />
              <Text style={{ fontSize: totalSize(paragraphTxt), color: COLOR_SECONDARY }}>{section.total_rating}</Text>
            </View>
            <Text style={{ fontSize: totalSize(paragraphTxt), textAlign:'left',color: Platform.OS === 'ios' ? 'gray' : null }}>{section.comment_time}</Text>
          </View>
          <View style={{ marginHorizontal: 4 }}>
            <Image source={isActive ? require('../../images/up-arrowImg.png') : require('../../images/dropDown.png')} style={{ height: height(2), width: width(4), resizeMode: 'contain' }} />
          </View>
        </TouchableOpacity>
        {
          isActive ?
            this._renderContent(section, index, isActive)
            :
            null
        }
      </View>
    );
  }
  _renderContent(section, index, isActive) {
    let txt = store.USER_REVIEWS.extra_text;
    let main_clr = store.settings.data.main_clr;
    return (
      <Animatable.View
        duration={500}
        animation="fadeInDown"
        iterationCount={1}
        direction="alternate"
        style={{ flex: 10, width: width(75), marginBottom: 10, marginHorizontal: 10, alignItems:'flex-start',alignSelf: 'flex-end', marginHorizontal: 15, borderBottomWidth: 0.4, borderColor: COLOR_GRAY }}>
        <HTMLView
          value={section.comment_desc}
          stylesheet={styles.longTxt}
        />
        <Text style={{ flex: 1, marginVertical: 5, fontSize: totalSize(1.4), textAlign:'left',fontWeight: 'bold', color: COLOR_SECONDARY }}>{txt.replybox_txt}</Text>
        <TextInput
          onChangeText={(value) => { this.setState({ comment: value }) }}
          underlineColorAndroid='transparent'
          placeholder={section.has_reply ? null : null}
          value={section.has_reply ? this.state.comment : null}
          placeholderTextColor='gray'
          multiline={true}
          scrollEnabled={true}
          underlineColorAndroid='transparent'
          autoCorrect={false}
          style={{ height: height(15), width: width(75), borderRadius: 5, marginVertical: 5, textAlign:'left',borderColor: COLOR_GRAY, borderWidth: 1, fontSize: totalSize(subHeadingTxt), paddingHorizontal: 10, textAlignVertical: 'top' }}
        />
        {
          this.state.postComment ?
            <View style={{ alignSelf: 'flex-start', borderRadius: 5, height: height(3),width:width(20),alignItems: 'center', justifyContent: 'center', backgroundColor: main_clr, marginVertical: 10 }}>
              <ActivityIndicator size='small' color={'white'} animating={true} />
            </View>
            :
            <TouchableOpacity style={{ alignSelf: 'flex-start', borderRadius: 5, alignItems: 'center', justifyContent: 'center', backgroundColor: main_clr, marginVertical: 10 }}
              onPress={async () => await this.postComment(section)}
            >
              <Text style={{ fontSize: 11, marginHorizontal: 7, marginVertical: 5, color: COLOR_PRIMARY }}>{txt.btn_txt}</Text>
            </TouchableOpacity>
        }
      </Animatable.View>
    );
  }
  render() {
    let data = store.USER_REVIEWS.data.received_reviews;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.reCaller === false && data.has_comments) {
                this.loadMore(data.review_type, data.received_pagination.next_page);
              }
              this.setState({ reCaller: true })
            }
          }}
          scrollEventThrottle={400}>
          <UpperView />
          <View style={styles.titleCon}>
            <Text style={styles.titleTxt}>{store.USER_REVIEWS.extra_text.received_txt}</Text>
          </View>
          {
            data.has_comments ?
              <View>
                {
                  data.commnets.map((item, key) => {
                    return (
                      <View key={key}>
                        {
                          this._renderHeader(item, key, item.is_Active)
                        }
                      </View>
                    );
                  })
                }
                {
                  data.received_pagination.has_next_page ?
                    <View style={{ height: height(7), width: width(100), justifyContent: 'center', alignItems: 'center' }}>
                      {
                        this.state.loadMore ?
                          <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
                          : null
                      }
                    </View>
                    :
                    null
                }
              </View>
              :
              <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.message}</Text>
              </View>
          }
        </ScrollView>
        {
          this.state.postComment ?
            <View style={{ height:height(90),width:width(100),position:'absolute',backgroundColor:'rgba(0,0,0,0.8)',justifyContent:'center',alignItems:'center' }}>
              <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
            </View>
            :
            null
        }
      </View>
    ); 
  }
}

export default withNavigation(ReceiveReview)