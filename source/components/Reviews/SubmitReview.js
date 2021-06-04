import React, { Component } from 'react';
import {
  Platform, Text, View, ActivityIndicator, Image, ImageBackground, TouchableOpacity, I18nManager,
  ScrollView, TextInput, FlatList
} from 'react-native';
import { Avatar } from 'react-native-elements';
import { width, height, totalSize } from 'react-native-dimension';
import Toast from 'react-native-simple-toast';
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import * as Animatable from 'react-native-animatable';
import HTMLView from 'react-native-htmlview';
import StarRating from 'react-native-star-rating';
import ApiController from '../../ApiController/ApiController';
import { withNavigation } from 'react-navigation';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Reviews/SubmitReviewStyleSheet';
import UpperView from './UpperView';

const subHeadingTxt = 1.5;
const paragraphTxt = 1.4;

class SubmitReview extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      name: '',
      loadMore: false,
      reCaller: false,
      postComment: false,
      rate: 0,
      title: '',
      comment: '',
      is_acordion: false,
      starCount: 0,
      activeSections: [0],
      avatorSources: [],
      images: [],
      progress: 0,
      is_ShowImage: false
    }
  }
  static navigationOptions = {
    header: null,
  };
  componentWillMount = async() => {
    let data = store.USER_REVIEWS.data.submitted_reviews;
    data.commnets.forEach(item=>{
      if (item.has_media) {
        item.comment_media.forEach((item)=>{
          item.checkStatus = false;
          item.added = false;
        })
      }
    })
  }
  multiImagePicker(section) {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      minFiles: 1,
      maxFiles: 5,
      compressImageQuality: 0.5
    }).then(async (images) => {
      // console.log('images=>>', images);
      let data = store.USER_REVIEWS.data.submitted_reviews;
      images.forEach(i => {
        var fileName = i.path.substring(i.path.lastIndexOf('/') + 1, i.path.length);
        this.state.avatorSources.push({ uri: i.path, type: i.mime, name: Platform.OS === 'ios' ? i.filename : fileName })
        this.state.images.push({ uri: i.path, width: i.width, height: i.height, mime: i.mime })
      })
      await this.uploadImages(section)
    }).catch((error) => {
      console.log('error:', error);
    });
  }
  uploadImages = async (section) => {
    let data = store.USER_REVIEWS.data.submitted_reviews;
    this.setState({ loading: true })
    let formData = new FormData();
    formData.append('comment_id', section.comment_id);
    if (this.state.avatorSources.length > 0) {
      for (let i = 0; i < this.state.avatorSources.length; i++) {
        formData.append('review_imgz[]', this.state.avatorSources[i]);
      }
    }
    //console.log('formData======>>>', formData);
    let config = {
      onUploadProgress: function (progressEvent) {
        store.UPLOADING_PROGRESS = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
        this.setState({ progress: parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)) })
        if (this.state.progress === 100) {
          this.setState({ postComment: true })
        }
        //console.log('uploading', store.UPLOADING_PROGRESS);
      }.bind(this)
    }
    // ApiController 
    try {
      ApiController.postAxios('upload-gallery-imgz', formData, config)
        .then(async (response) => {
          if (response.data.success) {
            data.commnets.forEach(item => {
              if (item.comment_id === section.comment_id) {
                item.has_media = true;
                item.comment_media = response.data.data.comment_media
                this.setState({ postComment: false })
              }
            })
            // Toast.show(response.data.message)
            this.setState({ loading: false })
          } else {
            Toast.show(response.data.message)
            this.setState({ loading: false })
          }
        }).catch((error) => {
          this.setState({ loading: false })
        })
    } catch (error) {
    }
  }
  loadMore = async (listType, pageNo) => {
    this.setState({ loadMore: true })
    let params = {
      review_type: listType,
      next_page: pageNo
    }
    let data = store.USER_REVIEWS.data.submitted_reviews;
    let response = await ApiController.post('my-own-reviews', params);
    // console.log('Tabs loadMore=====>>>', response);
    if (response.has_comments && data.submitted_pagination.has_next_page) {
      // forEach Loop LoadMore results
      response.commnets.forEach((item) => {
        item.added = false;
        item.checked = false;
        item.is_Active = false;
        data.commnets.push(item);
      })
      data.submitted_pagination = response.submitted_pagination;
      await this.setState({ loadMore: false })
    } else {
      await this.setState({ loadMore: false })
      // Toast.show(response.data.no_more)
    }
    await this.setState({ reCaller: false })
  }
  isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 20;
    return layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
  };
  deleteCloudImage = async (section,img) => {
    this.setState({ postComment: true })
    let data = store.USER_REVIEWS.data.submitted_reviews;
    let parameters = {
      comment_id: section.comment_id,
      image_id: img.image_id
    };
    try {
      let response = await ApiController.post('delete-review-img', parameters);      
      if (response.success) {
        data.commnets.forEach(item => {
          if (item.comment_id === section.comment_id) {
              item.has_media = true;
              item.comment_media = response.data.comment_media;
              this.setState({ loadMore: false })
          } else {
            item.has_media = false;
            this.setState({ loadMore: false })
          }
        })
        // Toast.show(response.message)
        this.setState({ postComment: false })
      } else {
        Toast.show(response.message)
        this.setState({ postComment: false })
      }
    } catch (error) {
      console.log('error:', error);
    }
  }
  editCollapse = async (section) => {
    store.USER_REVIEWS.data.submitted_reviews.commnets.forEach((item) => {
      if (item.comment_id === section.comment_id && item.checked === false) {
        item.checked = !section.checked;
        item.added = !section.added;
      } else {
        item.checked = false;
        item.added = false;
      }
      this.setState({ name: '' })
    })
  }
  headerCollapse = async (section) => {
    store.USER_REVIEWS.data.submitted_reviews.commnets.forEach(async (item) => {
      if (item.comment_id === section.comment_id && item.is_Active === false) {
        item.is_Active = !section.is_Active;
        await this.setState({
          title: section.comment_form_title,
          rate: section.rating_stars,
          comment: section.comment_desc
        })
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
      comment_title: this.state.title,
      comment_desc: this.state.comment,
      comment_stars: this.state.rate,
    }
    try {
      let response = await ApiController.post('submitted-reviews', params);
      console.log('response===>>>', response);
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
  _renderHeader = (section, index, isActive) => {
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity style={{ flexDirection: 'row', borderRadius: 5, marginVertical: 10, marginHorizontal: 15, borderBottomWidth: 0.4, borderColor: (isActive ? "#f9f9f9" : COLOR_GRAY) }} onPress={async () => {
          await this.headerCollapse(section)
        }}>
          <View style={{ height: height(8.5), alignItems: 'flex-start', justifyContent: 'flex-start', marginBottom: 10 }}>
            <Avatar
              medium
              rounded
              source={{ uri: section.commenter_dp }}
              activeOpacity={1}
              onPress={() => this.props.navigation.push('PublicProfileTab', { profiler_id: section.user_id, user_name: section.commenter_name })}
            />
          </View>
          <View style={{ flex: 2, marginHorizontal: 10, justifyContent: 'flex-start', marginBottom: 10 }}>
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
            <Text style={{ flex: 0.1, fontSize: totalSize(paragraphTxt), textAlign:'left',color: Platform.OS === 'ios' ? 'gray' : null }}>{section.comment_time}</Text>
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
  _renderContent = (section, index, isActive) => {

    let txt = store.USER_REVIEWS.extra_text;
    let main_clr = store.settings.data.main_clr;
    return (
      <Animatable.View
        duration={500}
        animation="fadeInDown"
        iterationCount={1}
        direction="alternate"
        style={{ flex: 10, width: width(75), alignItems:'flex-start',marginBottom: 10, marginHorizontal: 10, alignSelf: 'flex-end', marginHorizontal: 15, borderBottomWidth: 0.4, borderColor: COLOR_GRAY }}>
        <HTMLView
          value={section.comment_desc}
          stylesheet={styles.longTxt}
        />
        <TouchableOpacity style={{ flex: 1, justifyContent: 'center', flexDirection: 'row', marginVertical: 10 }} onPress={async () => await this.editCollapse(section)}>
          <View style={{ flex: 0.1, justifyContent: 'center' }}>
            <Image source={require('../../images/editReview.png')} style={{ flex: 0.2, height: height(2), width: width(3), resizeMode: 'contain' }} />
          </View>
          <Text style={{ flex: 2, fontSize: totalSize(subHeadingTxt), marginHorizontal: 5, fontWeight: 'bold', color: COLOR_SECONDARY }}>Edit Review</Text>
        </TouchableOpacity>
        {
          section.added && section.checked ?
            <Animatable.View
              duration={500}
              animation="fadeInDown"
              iterationCount={0}
              direction="alternate"
              style={{ marginTop: 5 }}>
              {
                txt.stars_enabled === '1' ?
                  <StarRating
                    disabled={false}
                    maxStars={5}
                    starSize={20}
                    fullStarColor={COLOR_ORANGE}
                    containerStyle={{ width: 120, marginBottom: 5 }}
                    rating={section.rating_stars.length === 0 ? 0 : this.state.rate}
                    selectedStar={(rating) => this.setState({ rate: rating })}
                  />
                  :
                  null
              }
              <TextInput
                onChangeText={(value) => this.setState({ title: value })}
                underlineColorAndroid='transparent'
                placeholder={section.comment_form_title !== '' ? section.comment_form_title : null}
                value={this.state.title}
                placeholderTextColor={COLOR_SECONDARY}
                underlineColorAndroid='transparent'
                autoCorrect={false}
                style={{ height: height(6), width: width(75), paddingHorizontal: 5, borderRadius: 5, marginVertical: 5, borderColor: COLOR_GRAY, borderWidth: 0.5, fontSize: totalSize(1.4) }}
              />
              {
                txt.gallery_enabled === '1' ?
                  <View style={styles.cameraCon}>
                    <TouchableOpacity style={styles.cameraSubCon} onPress={() => this.multiImagePicker(section)}>
                      <Image source={require('../../images/camera.png')} style={styles.cameraIcon} />
                    </TouchableOpacity>
                    <View style={styles.tickBtnCon}>
                      {
                        this.state.loading === false ?
                          this.state.images.length === 0 ?
                            <Image source={require('../../images/success.png')} style={{ height: height(8), width: width(15), resizeMode: 'contain' }} />
                            :
                            <Image source={require('../../images/successChecked.png')} style={{ height: height(8), width: width(15), resizeMode: 'contain' }} />
                          :
                          <Progress.Circle size={55} indeterminate={false} showsText={true} textStyle={{ fontSize: 11 }} progress={this.state.progress} color={store.settings.data.main_clr} />
                      }
                    </View>
                  </View>
                  :
                  nul
              }
              {
                section.has_media ?
                  <View style={{ width: width(75), marginVertical: 5, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
                    <ScrollView horizontal={true}>
                      {
                        section.has_media ?
                          section.comment_media.map((item, key) => {
                            return (
                              <View key={key} style={{ height: height(10), width: width(23), marginBottom: 5, marginRight: 5 }}>
                                <ImageBackground source={{ uri: item.urlz }} style={{ height: height(10), width: width(23) }}>
                                  <TouchableOpacity style={{ height: 20, width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }} onPress={()=>{this.deleteCloudImage(section,item)}}>
                                    <Text style={{ fontSize: 14, color: 'red' }}>X</Text>
                                  </TouchableOpacity>
                                </ImageBackground>
                              </View>
                            )
                          })
                          :
                          null
                      }
                    </ScrollView>
                  </View>
                  :
                  null
              }
              <TextInput
                onChangeText={(value) => this.setState({ comment: value })}
                underlineColorAndroid='transparent'
                placeholder={section.comment_form_desc}
                value={this.state.comment}
                placeholderTextColor={COLOR_SECONDARY}
                underlineColorAndroid='transparent'
                multiline={true}
                scrollEnabled={true}
                autoCorrect={true}
                style={{ height: height(15), width: width(75), paddingHorizontal: 10, borderRadius: 5, marginVertical: 5, borderColor: COLOR_GRAY, borderWidth: 0.5, fontSize: totalSize(1.4), textAlignVertical: 'top' }}
              />
              {
                this.state.postComment ?
                  <View style={{ alignSelf: 'flex-start', borderRadius: 5, height: height(3), width: width(20), alignItems: 'center', justifyContent: 'center', backgroundColor: main_clr, marginVertical: 10 }}>
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
            :
            null
        }
      </Animatable.View>
    );
  }
  _updateSections = activeSections => {
    if (activeSections !== false) {
      this.state.activeSections.push(activeSections)
    }
    // console.warn('update', this.state.activeSections);
  };
  render() {
    let data = store.USER_REVIEWS.data.submitted_reviews;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (this.isCloseToBottom(nativeEvent)) {
              if (this.state.reCaller === false && data.has_comments) {
                this.loadMore(data.review_type, data.submitted_pagination.next_page);
              }
              this.setState({ reCaller: true })
            }
          }}
          scrollEventThrottle={400}>
          <UpperView />
          <View style={styles.titleCon}>
            <Text style={styles.titleTxt}>{store.USER_REVIEWS.extra_text.submitted_txt}</Text>
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
                  data.submitted_pagination.has_next_page ?
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
            <View style={{ height: height(90), width: width(100), position: 'absolute', backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' }}>
              <ActivityIndicator size='large' color={store.settings.data.navbar_clr} animating={true} />
            </View>
            :
            null
        }
      </View>
    );
  }
}

export default withNavigation(SubmitReview)