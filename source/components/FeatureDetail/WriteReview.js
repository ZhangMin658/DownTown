import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, ActivityIndicator,
  ScrollView, TextInput, FlatList
} from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import ImagePicker from 'react-native-image-crop-picker';
import Modal from "react-native-modal";
import * as Progress from 'react-native-progress';
import Toast from 'react-native-simple-toast';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW } from '../../../styles/common';
import StarRating from 'react-native-star-rating';
import ApiController from '../../ApiController/ApiController';
import store from '../../Stores/orderStore';
import Claim from './Claim'
import Report from './Report'
import styles from '../../../styles/WriteReviewStyleSheet';
import FeatureDetail from './FeatureDetail';
export default class WriteReview extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      rate: 1,
      progress: 0,
      title: '',
      comment: '',
      loading: false,
      uploadImages: false,
      postImages: false,
      avatorSources: [],
      images: [],
      reportModel: false,
      isClaimVisible: false,
    }
  }
  static navigationOptions = {
    header: null,
  };
  componentWillMount = async () => {
    let data = store.home.FEATURE_DETAIL.data.listing_detial.write_reviews;
    data.comment_media.forEach(item => {
      item.checkStatus = false;
    })
  }
  postReview = async () => {
    this.setState({ loading: true })
    let data = store.home.FEATURE_DETAIL.data.listing_detial;
    let params = {
      listing_id: data.listing_id,
      comment_title: this.state.title,
      comment_desc: this.state.comment,
      comment_stars: this.state.rate
    }
    let response = await ApiController.post('submit-review', params);
    if (response.success) {
      Toast.show(response.message);
      this.setState({ loading: false, title: '', comment: '', rate: 0 })
    } else {
      Toast.show(response.message);
      this.setState({ loading: false, title: '', comment: '', rate: 0 })
    }
  }
  multiImagePicker() {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      includeExif: true,
      forceJpg: true,
      minFiles: 1,
      maxFiles: 5,
      compressImageQuality: 0.5
    }).then(async (images) => {
      images.forEach(i => {
        var fileName = i.path.substring(i.path.lastIndexOf('/') + 1, i.path.length);
        this.state.avatorSources.push({ uri: i.path, type: i.mime, name: Platform.OS === 'ios' ? i.filename : fileName })
        this.state.images.push({ uri: i.path, width: i.width, height: i.height, mime: i.mime })
        // this.setState({ sizeImage: this.state.sizeImage + i.size })
      })
      await this.uploadImages()
    }).catch((error) => {
      console.log('error:', error);
    });
  }
  deleteCloudImage = async (img) => {
    let data = store.home.FEATURE_DETAIL.data.listing_detial.write_reviews;
    data.comment_media.forEach(item => {
      if (item.image_id === img.image_id && img.checkStatus === false) {
        item.checkStatus = true;
        this.setState({ loading: false })
      } else {
        item.checkStatus = false;
      }
    })
    try {
      let parameters = {
        image_id: img.image_id
      };
      let response = await ApiController.post('del-rev-img', parameters);
      if (response.success) {
        if (response.data.comment_media !== []) {
          data.comment_media = response.data.comment_media;
          data.comment_media.forEach(item => {
            item.checkStatus = false;
          })
          await this.setState({ loading: false })
        } else {
          data.comment_media = response.data.comment_media;
          await this.setState({ loading: false })
        }
        // Toast.show(response.message)
      } else {
        Toast.show(response.message)
        data.comment_media.forEach(item => {
          item.checkStatus = false;
        })
        this.setState({ loading: false })
      }
    } catch (error) {
      console.log('error:', error);
    }
  }
  uploadImages = async () => {
    let data = store.home.FEATURE_DETAIL.data.listing_detial.write_reviews;
    this.setState({ uploadImages: true })
    let formData = new FormData();
    formData.append('listing_id', store.LIST_ID)
    if (this.state.avatorSources.length > 0) {
      for (let i = 0; i < this.state.avatorSources.length; i++) {
        formData.append('comment_reviews[]', this.state.avatorSources[i]);
      }
    }
    let config = {
      onUploadProgress: async function (progressEvent) {
        await this.setState({ progress: progressEvent.loaded / progressEvent.total })
        if (this.state.progress === 1) {
          await this.setState({ postImages: true })
        }
        // console.log('uploading', this.state.progress);
      }.bind(this)
    }
    try {
      ApiController.postAxios('list-review-imgz', formData, config)
        .then(async (response) => {
          if (response.data.success) {
            data.has_comment_gallery = true;
            data.comment_media = response.data.data.comment_media;
            await this.setState({ uploadImages: false, postImages: false, avatorSources: [], images: [], progress: 0 })
          } else {
            Toast.show(response.data.message)
            this.setState({ uploadImages: false, postImages: false, progress: 0 })
          }
        }).catch((error) => {
          x
          this.setState({ uploadImages: false, postImages: false, progress: 0 })
        })
    } catch (error) {
      this.setState({ uploadImages: false, postImages: false, progress: 0 })
      //console.log('trycatch error==>>', error);
    }
  }
  setModalVisible = (state, prop) => {
    if (state === 'claim' && prop === false) {
      this.setState({ reportModel: false, isClaimVisible: true })
    } else {
      if (state === 'report') {
        this.setState({ reportModel: true, isClaimVisible: false })
      }
    }
  }
  hideModels = (state, hide) => {
    if (state === 'claim') {
      this.setState({ isClaimVisible: hide, reportModel: hide })
    } else {
      if (state === 'report') {
        this.setState({ reportModel: hide, reportModel: hide })
      }
    }
  }
  renderAsset(image) {
    if (image.mime && image.mime.toLowerCase().indexOf('video/') !== -1) {
      return this.renderVideo(image);
    }

    return this.renderImage(image);
  }
  renderImage(image) {
    return (
      <ImageBackground source={image} style={{ height: height(10), width: width(20) }}>
        <TouchableOpacity style={{ height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }}>
          <Text style={{ fontSize: totalSize(2), color: 'red' }}>X</Text>
        </TouchableOpacity>
      </ImageBackground>
    )
  }
  render() {
    let data = store.home.FEATURE_DETAIL.data.listing_detial;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={styles.container}>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <FeatureDetail callModel={this.setModalVisible} />
          {
            data.write_reviews.is_user_logged_in ?
              <View>
                {
                  data.write_reviews.stars_enabled === '1' ?
                    <View style={styles.ratingCon}>
                      <StarRating
                        disabled={false}
                        maxStars={5}
                        starSize={30}
                        fullStarColor={main_clr}
                        containerStyle={{ marginRight: 5, alignSelf: 'flex-start' }}
                        rating={this.state.rate}
                        selectedStar={(rating) => this.setState({ rate: rating })}
                      />
                    </View>
                    :
                    null
                }
                <View style={styles.titleCon}>
                  <TextInput
                    onChangeText={(value) => this.setState({ title: value })}
                    underlineColorAndroid='transparent'
                    value={this.state.title}
                    placeholder={data.write_reviews.for_title_placeholder}
                    placeholderTextColor='gray'
                    returnKeyLabel='Done'
                    returnKeyType='done'
                    selectionColor='black'
                    underlineColorAndroid='transparent'
                    autoCorrect={false}
                    style={styles.inputTxt}
                  />
                </View>
                {
                  data.write_reviews.gallery_enabled === '1' ?
                    <View style={styles.cameraCon}>
                      <TouchableOpacity style={styles.cameraSubCon} onPress={() => this.multiImagePicker()}>
                        <Image source={require('../../images/camera.png')} style={styles.cameraIcon} />
                        <Text style={styles.cameraBtnTxt}>{data.write_reviews.for_chosse_img}</Text>
                      </TouchableOpacity>
                      <View style={styles.tickBtnCon}>
                        {
                          this.state.uploadImages ?
                            <View style={{ marginHorizontal: 20, marginTop: 5 }}>
                              <Progress.Pie size={100} indeterminate={false} showsText={true} textStyle={{ fontSize: 10 }} progress={this.state.progress} color={main_clr} />
                            </View>
                            :
                            this.state.images.length === 0 ?
                              <Image source={require('../../images/success.png')} style={{ height: height(10), width: width(20), resizeMode: 'contain' }} />
                              :
                              <Image source={require('../../images/successChecked.png')} style={{ height: height(10), width: width(20), resizeMode: 'contain' }} />
                        }
                      </View>
                    </View>
                    :
                    null
                }
                {
                  data.write_reviews.has_comment_gallery ?
                    <ScrollView
                      style={{ marginVertical: 5, marginHorizontal: 32 }}
                      horizontal={true}>
                      {
                        data.write_reviews.comment_media.map((item, key) => {
                          return (
                            <View key={key} style={{ height: height(10), width: width(23), marginVertical: 5, marginTop: 10, marginRight: 5 }}>
                              <ImageBackground source={{ uri: item.urlz }} style={{ height: height(10), width: width(23) }}>
                                <View style={{ height: height(10), width: width(23), alignItems: 'flex-end', position: 'absolute' }}>
                                  {
                                    item.checkStatus ?
                                      <View style={{ height: height(10), width: width(23), backgroundColor: item.checkStatus ? 'rgba(0,0,0,0.7)' : null, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size='large' animating={true} color={COLOR_PRIMARY} />
                                      </View>
                                      :
                                      <TouchableOpacity style={{ height: 20, width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }} onPress={() => { this.deleteCloudImage(item) }}>
                                        <Text style={{ fontSize: 14, color: 'red' }}>X</Text>
                                      </TouchableOpacity>
                                  }
                                </View>

                              </ImageBackground>
                            </View>
                          )
                        })
                      }
                    </ScrollView>
                    :
                    null
                }
                <View style={styles.reviewCon}>
                  <TextInput
                    onChangeText={(value) => this.setState({ comment: value })}
                    underlineColorAndroid='transparent'
                    value={this.state.comment}
                    placeholder={data.write_reviews.for_area_placeholder}
                    placeholderTextColor='gray'
                    multiline={true}
                    returnKeyLabel='Done'
                    returnKeyType='done'
                    selectionColor='black'
                    underlineColorAndroid='transparent'
                    autoCorrect={false}
                    style={styles.inputTxtReview}
                  />
                </View>
                {
                  this.state.loading ?
                    <View style={[styles.reviewBtn, { backgroundColor: main_clr }]} onPress={() => this.postReview()}>
                      <ActivityIndicator color='white' size='large' animating={true} style={{ marginVertical: 5 }} />
                    </View>
                    :
                    <TouchableOpacity style={[styles.reviewBtn, { backgroundColor: main_clr }]} onPress={() => this.postReview()}>
                      <Text style={styles.reviewBtnTxt}>{data.write_reviews.btn_txt}</Text>
                    </TouchableOpacity>
                }
              </View>
              :
              <View style={{ height: height(12), marginTop: 20, flexDirection: 'row', width: width(100), alignItems: 'center', backgroundColor: '#feebe6', alignSelf: 'center' }}>
                <Image source={require('../../images/profileWarning.png')} style={{ height: height(7), width: width(15), resizeMode: 'contain', marginHorizontal: 20 }} />
                <Text style={{ fontSize: totalSize(2), color: COLOR_SECONDARY }}>{data.write_reviews.message}</Text>
              </View>
          }
        </ScrollView>
        <Modal
          animationInTiming={500}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.reportModel}
          onBackdropPress={() => this.setState({ reportModel: false })}
          style={{ flex: 1 }}>
          <Report hideModels={this.hideModels} />
        </Modal>
        <Modal
          animationInTiming={500}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.isClaimVisible}
          onBackdropPress={() => this.setState({ isClaimVisible: false })}
          style={{ flex: 1 }}>
          <Claim hideModels={this.hideModels} />
        </Modal>
      </View>
    );
  }
}
