//***********************//
//****  Usama Butt  ****//
//**********************//

import React, { Component } from 'react';
import { Text, View, Image, ImageBackground,I18nManager, Platform, ActivityIndicator, TouchableOpacity, ScrollView, TextInput, Picker } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { width, height, totalSize } from 'react-native-dimension';
import ImagePicker from 'react-native-image-crop-picker';
import { Icon } from 'react-native-elements';
import Modal from "react-native-modal";
import * as Progress from 'react-native-progress';
import ApiController from '../../ApiController/ApiController';
import Toast from 'react-native-simple-toast';
// import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import DatePicker from 'react-native-datepicker';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_DARK_GRAY } from '../../../styles/common';
import store from '../../Stores/orderStore';
import styles from '../../../styles/Events/CreateEventStyleSheet';
import EventsUpperView from './EventsUpperView';
import { withNavigation } from 'react-navigation';


class CreateEvent extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      is_picker: false,
      isCategory: false,
      images: [],
      predictions: [],
      location: '',
      latitude: null,
      longitude: null,
      eventTitle: '',
      cate_id: '',
      cate_name: '',
      phoneNo: '',
      email: '',
      description: '',
      start_date: '',
      end_date: '',
      related_listing: '',
      list_name: '',
      avatorSources: [],
      editImages: [],
      sizeImage: 0,
      progress: 0
    }
    this.getHTML = this.getHTML.bind(this);
    this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }
  onEditorInitialized() {
    this.setFocusHandlers();
    this.getHTML();
  }

  async getHTML() {
    const titleHtml = await this.richtext.getTitleHtml();
    const contentHtml = await this.richtext.getContentHtml();
    //alert(titleHtml + ' ' + contentHtml)
  }
  componentWillMount = async () => {
    let { params } = this.props.navigation.state;
    if (params.eventMode !== 'create') {
      let data = store.MY_EVENTS.data.create_event;
      if (data.category.value !== '') {
        data.category.dropdown.forEach(async (item) => {
          if (item.category_id === data.category.value) {
            await this.setState({ cate_name: item.category_name })
          }
        })
      }
      if (data.related.dropdown !== null) {
        data.related.dropdown.forEach(async (item) => {
          if (item.listing_id === data.related.value) {
            await this.setState({ list_name: item.listing_title })
          }
        })
      }
      await this.setState({
        eventTitle: data.title.value,
        phoneNo: data.phone.value,
        email: data.email.value,
        cate_id: data.category.value,
        related_listing: data.related.value,
        description: data.desc.value,
        start_date: data.date_start.value,
        end_date: data.date_end.value,
        location: data.location.value,
        latitude: data.latt.value === '' ? null : data.latt.value,
        longitude: data.long.value === '' ? null : data.long.value,
        editImages: data.gallery.has_gallery ? data.gallery.dropdown : [],
      })
    }
  }
  createEvent = async () => {
    let data = store.MY_EVENTS.data;
    let { params } = this.props.navigation.state;

    if (this.state.cate_id === '' || this.state.eventTitle === '' || this.state.email === '' || this.state.phoneNo === '' || this.state.description === '' || this.state.start_date === '' || this.state.end_date === '' || this.state.avatorSources.length === 0 || this.state.location === '') {
      Toast.show(data.required_msg)
    } else {
      this.setState({ loading: true })
      let formData = new FormData();
      formData.append('title', this.state.eventTitle);
      formData.append('category', this.state.cate_id);
      formData.append('number', this.state.phoneNo);
      formData.append('email', this.state.email);
      formData.append('desc', this.state.description);
      formData.append('start_date', this.state.start_date);
      formData.append('end_date', this.state.end_date);
      formData.append('venue', this.state.location);
      formData.append('lat', this.state.latitude);
      formData.append('long', this.state.longitude);
      formData.append('parent_listing', this.state.related_listing);
      if (this.state.avatorSources.length > 0) {
        for (let i = 0; i < this.state.avatorSources.length; i++) {
          formData.append('event_multiple_attachments[]', this.state.avatorSources[i]);
        }
      }
      //console.log('formData======>>>',formData);   
      let config = {
        onUploadProgress: function (progressEvent) {
          store.UPLOADING_PROGRESS = parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total));
          this.setState({ progress: parseInt(Math.round((progressEvent.loaded * 100) / progressEvent.total)) })
          console.log('uploading', this.state.progress);
        }.bind(this)
      }
      // ApiController 
      try {
        ApiController.postAxios('event-submission', formData, config)
          .then(async (response) => {
            //console.log('Event create========>>>>', response);
            if (response.data.success) {
              await params._eventAdded(response.data.data)
              Toast.show(response.data.message)
              await this.clearFields()
              store.refresh = true;
              ///
              this.props.navigation.push('EventDetail', { event_id: response.data.event_id, title: this.state.eventTitle, headerColor: store.settings.data.navbar_clr })
              this.setState({ loading: false })
            } else {
              Toast.show(response.data.message)
              this.setState({ loading: false })
            }
          }).catch((error) => {
            //console.log('axios error==>>', error);
            this.setState({ loading: false })
          })
      } catch (error) {
        //console.log('trycatch error==>>', error);
      }
    }
  }
  editEvent = async () => {
    let data = store.MY_EVENTS.data;
    let { params } = this.props.navigation.state;
    // console.log('images check ===>>>',this.state.editImages);

    if (this.state.cate_id === '' || this.state.eventTitle === '' || this.state.email === '' || this.state.phoneNo === '' || this.state.description === '' || this.state.start_date === '' || this.state.end_date === '' || this.state.location === '') {
      Toast.show(data.required_msg)
    } else {
      this.setState({ loading: true })
      let formData = new FormData();
      formData.append('title', this.state.eventTitle);
      formData.append('category', this.state.cate_id);
      formData.append('number', this.state.phoneNo);
      formData.append('email', this.state.email);
      formData.append('desc', this.state.description);
      formData.append('start_date', this.state.start_date);
      formData.append('end_date', this.state.end_date);
      formData.append('venue', this.state.location);
      formData.append('lat', this.state.latitude);
      formData.append('long', this.state.longitude);
      formData.append('parent_listing', this.state.related_listing);
      formData.append('is_update', params.eventID)
      if (this.state.avatorSources.length > 0) {
        for (let i = 0; i < this.state.avatorSources.length; i++) {
          formData.append('event_multiple_attachments[]', this.state.avatorSources[i]);
        }
      }
      //console.log('formData======>>>', formData);
      let config = {
        onUploadProgress: async function (progressEvent) {
          store.UPLOADING_PROGRESS = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          this.setState({ progress: progressEvent.loaded / progressEvent.total })
          //console.log('uploading', this.state.progress);
        }.bind(this)
      }
      //ApiController 
      try {
        ApiController.postAxios('event-submission', formData, config)
          .then(async (response) => {
            // console.log('Event edit========>>>>', response);
            if (response.data.success) {
              Toast.show(response.data.message)
              await this.clearFields()
              this.props.navigation.push('EventDetail', { event_id: response.data.event_id, title: this.state.eventTitle, headerColor: store.settings.data.navbar_clr })
              this.setState({ loading: false })
            } else {
              Toast.show(response.data.message)
              this.setState({ loading: false })
            }
          }).catch((error) => {
            //console.log('axios error==>>', error);
            this.setState({ loading: false })
          })
      } catch (error) {
        //console.log('trycatch error==>>', error);
      }
    }
  }
  clearFields = async () => {
    await this.setState({
      eventTitle: '',
      cate_id: '',
      cate_name: '',
      phoneNo: '',
      email: '',
      description: '',
      start_date: '',
      end_date: '',
      related_listing: '',
      list_name: '',
      avatorSources: [],
      images: [],
      editImages: [],
      latitude: null,
      location: '',
      longitude: null,
      progress: 0
    })
  }
  async componentWillUnmount() {
    await this.clearFields()
  }
  setFocusHandlers() {
    this.richtext.setTitleFocusHandler(() => {
      //alert('title focus');
    });
    this.richtext.setContentFocusHandler(() => {
      //alert('content focus');
    });
  }
  static navigationOptions = ({ navigation }) => ({
    
    headerTitle: store.MY_EVENTS.data.create,
    headerTintColor: COLOR_PRIMARY,
    headerStyle: {
      backgroundColor: store.settings.data.main_clr
    },
  });
  placesComplete = async (text) => {
    if (text.length > 0) {
      // const API_KEY = 'AIzaSyDVcpaziLn_9wTNCWIG6K09WKgzJQCW2tI'; // new
      const API_KEY = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';  //old play4team
      fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + text+'&types=address' + '&key=' + API_KEY)
        .then((response) => response.json())
        .then(func = async (responseJson) => {
          // console.log('result Places AutoComplete===>>', responseJson);
          if (responseJson.status === 'OK') {
            await this.setState({ predictions: responseJson.predictions })
          }
        }).catch((error) => {
          console.log('error', error);
        });
    } else {
      this.setState({ predictions: [] })
    }
  }
  getLatLong = async (address) => {
    this.setState({ location: address })
    let api_key = 'AIzaSyDYq16-4tDS4S4bcwE2JiOa2FQEF5Hw8ZI';
    fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + api_key)
      .then((response) => response.json())
      .then(func = async (responseJson) => {
        // console.warn('latLong', responseJson);
        if (responseJson.status === 'OK') {
          await this.setState({
            latitude: responseJson.results[0].geometry.location.lat,
            longitude: responseJson.results[0].geometry.location.lng,
            predictions: []
          })
          console.warn(this.state.latitude, this.state.longitude);
        }
      })
  }
  selectListing = async (itemValue, itemIndex) => {
    let data = store.MY_EVENTS.data.create_event;
    await this.setState({ related_listing: itemValue });
    data.related.dropdown.forEach(async (item) => {
      if (item.listing_id === itemValue) {
        await this.setState({ list_name: item.listing_title })
      }
    });
  }
  selectCategory = async (itemValue, itemIndex) => {
    let data = store.MY_EVENTS.data.create_event;
    await this.setState({ cate_id: itemValue });
    data.category.dropdown.forEach(async (item) => {
      if (item.category_id === itemValue) {
        await this.setState({ cate_name: item.category_name })
      }
    });

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
        this.setState({ sizeImage: this.state.sizeImage + i.size })
      })
    }).catch((error) => {
      //console.log('error:', error);
    });
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
        <TouchableOpacity style={{ height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }} onPress={() => this.removeLocalImage(image)}>
          <Text style={{ fontSize: totalSize(2), color: 'red' }}>X</Text>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
  removeLocalImage = async (image) => {
    for (let i = 0; i < this.state.images.length; i++) {
      if (image.uri === this.state.images[i].uri) {
        this.state.images.splice(this.state.images.indexOf(image.uri), 1);
        this.setState({ loading: false })
      }
    }
    for (let i = 0; i < this.state.avatorSources.length; i++) {
      if (image.uri === this.state.avatorSources[i].uri) {
        this.state.avatorSources.splice(this.state.avatorSources.indexOf(image.uri), 1);
        this.setState({ loading: false })
      }
    }
  }
  deleteCloudImage = async (img) => {
    let data = store.MY_EVENTS.data.create_event;
    let { params } = this.props.navigation.state;
    let parameters = {
      event_id: params.eventID,
      image_id: img.image_id
    };
    data.gallery.dropdown.forEach(item => {
      if (item.image_id === img.image_id && img.checkStatus === false) {
        item.checkStatus = true;
      } else {
        item.checkStatus = false;
      }
    })
    await this.setState({ editImages: data.gallery.dropdown })
    try {
      let response = await ApiController.post('delete-event-img', parameters);
      if (response.success) {
        if (response.data.gallery.has_gallery) {
          response.data.gallery.dropdown.forEach(item => {
            item.checkStatus = false;
          })
          data.gallery = response.data.gallery;
          await this.setState({ editImages: data.gallery.dropdown })
        } else {
          await this.setState({ editImages: [] })
        }
        // Toast.show(response.message)
      } else {
        Toast.show(response.message)
        data.gallery.dropdown.forEach(item => {
          item.checkStatus = false;
        })
        this.setState({ loading: false })
      }
    } catch (error) {
      console.log('error:', error);
    }
  }

  render() {
    let { params } = this.props.navigation.state;
    let data = store.MY_EVENTS.data.create_event;
    var date = new Date().toDateString();
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <EventsUpperView />
            <View style={styles.textInputCon}>
              <Text style={styles.textInputLabel}>{data.title.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                onChangeText={(value) => this.setState({ eventTitle: value })}
                placeholder={data.title.placeholder}
                value={data.title.value !== '' ? this.state.eventTitle : null}
                placeholderTextColor='gray'
                underlineColorAndroid='transparent'
                autoCorrect={false}
                style={[styles.textInput,I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
              />
            </View>
            <View style={styles.textInputCon}>
              <Text style={styles.textInputLabel}>{data.category.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
              {
                Platform.OS === 'android' ?
                  <View style={{ height: 45, width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                    <Picker
                      selectedValue={this.state.cate_id}
                      style={{ height: 45, width: width(90) }}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({ cate_id: itemValue })
                      }>
                      <Picker.Item label={data.category.placeholder} />
                      {
                        data.category.dropdown.map((item, key) => {
                          return (
                            <Picker.Item key={key} label={item.category_name} value={item.category_id} />
                          );
                        })
                      }
                    </Picker>
                  </View>
                  :
                  <TouchableOpacity style={{ height: 50, width: width(90), alignItems: 'center', flexDirection: 'row', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }} onPress={() => this.setState({ isCategory: !this.state.isCategory })}>
                    <View style={{ alignItems:'flex-start', width: width(80) }}>
                      <Text style={{ marginHorizontal: 8 }}>{this.state.cate_name.length !== 0 ? this.state.cate_name : data.category.placeholder}</Text>
                    </View>
                    <Icon
                      size={14}
                      name='caretdown'
                      type='antdesign'
                      color='gray'
                    />
                  </TouchableOpacity>
              }
            </View>
            <View style={styles.textInputCon}>
              <Text style={styles.textInputLabel}>{data.phone.main_title}</Text>
              <TextInput
                onChangeText={(value) => this.setState({ phoneNo: value })}
                value={this.state.phoneNo}
                placeholder={data.phone.placeholder}
                placeholderTextColor='gray'
                keyboardType='phone-pad'
                underlineColorAndroid='transparent'
                autoCorrect={false}
                style={[styles.textInput,I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
              />
            </View>
            <View style={styles.textInputCon}>
              <Text style={styles.textInputLabel}>{data.email.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                onChangeText={(value) => this.setState({ email: value })}
                value={this.state.email}
                placeholder={data.email.placeholder}
                placeholderTextColor='gray'
                underlineColorAndroid='transparent'
                autoCorrect={false}
                style={[styles.textInput,I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
              />
            </View>
            <View style={styles.aboutInputCon}>
              <Text style={styles.textInputLabel}>{data.desc.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                onChangeText={(value) => this.setState({ description: value })}
                value={this.state.description}
                placeholder={data.desc.placeholder}
                placeholderTextColor='gray'
                underlineColorAndroid='transparent'
                autoCorrect={true}
                multiline={true}
                scrollEnabled={true}
                style={[styles.aboutInputText,I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
              />
            </View>
            <View style={styles.textInputCon}>
              <View style={{ alignItems: 'center', flexDirection: 'row', marginVertical: 3 }}>
                <View style={{ width: width(45), alignItems:'flex-start' }}>
                  <Text style={styles.dateLabel}>{data.date_start.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                </View>
                <View style={{ width: width(45), alignItems:'flex-start' }}>
                  <Text style={styles.dateLabel}>{data.date_end.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                </View>
              </View>
              <View style={{ marginVertical: 5, justifyContent: 'center', flexDirection: 'row', width: width(90) }}>
                <View style={{ width: width(45), borderRadius: 3, borderColor: 'COLOR_GRAY', marginRight: 2, borderWidth: 0.3 }}>
                  <DatePicker
                    style={{ width: width(45) }}
                    date={this.state.start_date}
                    mode="datetime"
                    androidMode='spinner' //spinner
                    showIcon={true}
                    placeholder={data.date_start.placeholder}
                    duration={400}
                    format="MM/DD/YYYY hh:mm a"
                    minDate="1/12/2018"
                    maxDate="1/12/2030"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    disabled={false}
                    is24Hour={true}
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 2,
                        marginTop: 6,
                        height: 20,
                        width: 20
                      },
                      dateInput: {
                        marginLeft: 0,
                        borderWidth: 0,
                      }
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => { this.setState({ start_date: date }) }}
                  />
                </View>
                <View style={{ width: width(45), borderRadius: 3, borderColor: 'COLOR_GRAY', marginLeft: 2, borderWidth: 0.3 }}>
                  <DatePicker
                    style={{ width: width(45) }}
                    date={this.state.end_date}
                    is24Hour={false}
                    mode="datetime"
                    androidMode='spinner' //spinner
                    showIcon={true}
                    placeholder={data.date_end.placeholder}
                    duration={400}
                    format="MM/DD/YYYY hh:mm a"
                    minDate="1/12/2018"
                    maxDate="1/12/2030"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    disabled={false}
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 4,
                        marginLeft: 2,
                        marginTop: 6,
                        height: 20,
                        width: 20
                      },
                      dateInput: {
                        marginLeft: 0,
                        borderWidth: 0,
                      }
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={(date) => { this.setState({ end_date: date }) }}
                  />
                </View>
              </View>
            </View>
            <View style={{ marginHorizontal: 15, marginVertical: 0 }}>
              <Text style={styles.textInputLabel}>{data.gallery.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
              <View style={styles.cameraCon}>
                <TouchableOpacity style={styles.cameraSubCon} onPress={() => this.multiImagePicker()}>
                  <Image source={require('../../images/camera.png')} style={styles.cameraIcon} />
                  <Text style={styles.cameraBtnTxt}>{data.gallery.placeholder}</Text>
                </TouchableOpacity>
                <View style={styles.tickBtnCon}>
                  {
                    this.state.images.length === 0 ?
                      <Image source={require('../../images/success.png')} style={{ height: height(10), width: width(20), resizeMode: 'contain' }} />
                      :
                      <Image source={require('../../images/successChecked.png')} style={{ height: height(10), width: width(20), resizeMode: 'contain' }} />
                  }
                </View>
              </View>
            </View>
            <View style={{ flex: 1, marginHorizontal: 15, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' }}>
              {
                this.state.images.length > 0 || this.state.editImages !== [] ?
                  <View style={{ flex: 1, flexDirection: 'row', marginVertical: 10, alignSelf: 'center', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
                    <ScrollView
                      horizontal={true}>
                      {this.state.images ? this.state.images.map(i => <View key={i.uri} style={{ marginRight: 5, marginVertical: 3 }}>{this.renderAsset(i)}</View>) : null}
                      {
                        this.state.editImages.length > 0 && data.gallery.has_gallery ?
                          data.gallery.dropdown.map((item, key) => {
                            return (
                              <View key={key} style={{ marginRight: 5, marginVertical: 3 }}>
                                <Image source={{ uri: item.url }} style={{ height: height(10), width: width(20) }} />
                                <View style={{ height: height(10), width: width(20), alignItems: 'flex-end', position: 'absolute' }}>
                                  {
                                    item.checkStatus ?
                                      <View style={{ height: height(10), width: width(20), backgroundColor: item.checkStatus ? 'rgba(0,0,0,0.5)' : null, justifyContent: 'center', alignItems: 'center' }}>
                                        <ActivityIndicator size='large' animating={true} color={COLOR_PRIMARY} />
                                      </View>
                                      :
                                      <TouchableOpacity style={{ height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.9)', alignSelf: 'flex-end' }} onPress={async () => await this.deleteCloudImage(item)}>
                                        <Text style={{ fontSize: totalSize(2), color: 'red' }}>X</Text>
                                      </TouchableOpacity>
                                  }
                                </View>
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
            </View>
            <View style={styles.textInputCon}>
              <Text style={styles.textInputLabel}>{data.location.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
              <TextInput
                onChangeText={(value) => { this.setState({ location: value }), this.placesComplete(value) }}
                placeholder={data.location.placeholder}
                value={this.state.location}
                placeholderTextColor='gray'
                underlineColorAndroid='transparent'
                autoCorrect={true}
                style={[styles.textInput,I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'}]}
              />
            </View>
            {
              this.state.predictions.length > 0 ?
                <View style={{ alignSelf: 'center', width: width(90), backgroundColor: 'white', marginVertical: 5, elevation: 3 }}>
                  <ScrollView>
                    {
                      this.state.predictions.map((item, key) => {
                        return (
                          <TouchableOpacity key={key} style={{ height: height(6), width: width(90), justifyContent: 'center', marginBottom: 0.5, backgroundColor: 'white', borderBottomWidth: 0.5, borderColor: COLOR_GRAY }}
                            onPress={() => this.getLatLong(item.description)}
                          >
                            <Text style={{ marginHorizontal: 10 }}>{item.description}</Text>
                          </TouchableOpacity>
                        );
                      })
                    }
                  </ScrollView>
                </View>
                : null
            }
            <View style={styles.mapCon}>
              <MapView
                ref={(ref) => this.mapView = ref}
                zoomEnabled={true}
                zoomControlEnabled={true}
                showsBuildings={true}
                showsIndoors={true}
                provider={PROVIDER_GOOGLE}
                showsMyLocationButton={true}
                showsUserLocation={true}
                followsUserLocation={true}
                minZoomLevel={5}
                maxZoomLevel={20}
                mapType={"standard"}
                loadingEnabled={true}
                loadingIndicatorColor={'#ffffff'}
                loadingBackgroundColor='gray'
                moveOnMarkerPress={false}
                style={styles.map}
                region={{
                  latitude: parseFloat(this.state.latitude) || 31.582045,
                  longitude: parseFloat(this.state.longitude) || 74.329376,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421
                }}
              >
                {
                  this.state.latitude !== null && this.state.longitude !== null ?
                    <MapView.Marker
                      coordinate={
                        { latitude: parseFloat(this.state.latitude), longitude: parseFloat(this.state.longitude) }
                      }
                      title={'Current location'}
                      // description={'I am here'}
                      pinColor={'#3edc6d'}
                    />
                    :
                    null
                }
              </MapView>
            </View>
            <View style={styles.textInputCon}>
              <View style={{ height: height(2), alignItems: 'center', marginBottom: 5, flexDirection: 'row' }}>
                <View style={{ width: width(45), alignItems:'flex-start' }}>
                  <Text style={styles.dateLabel}>{data.long.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                </View>
                <View style={{ width: width(45), alignItems:'flex-start' }}>
                  <Text style={styles.dateLabel}>{data.latt.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
                </View>
              </View>
              <View style={{ height: height(6.5), justifyContent: 'center', flex: 1, flexDirection: 'row' }}>
                <View style={{ height: height(5.5), flex: 1, borderRadius: 3, borderColor: 'COLOR_GRAY', marginRight: 2, borderWidth: 0.3, justifyContent: 'center', alignItems:'flex-start' }}>
                  <Text style={{ fontSize: totalSize(1.4), color: 'black', paddingHorizontal: 7 }}>{this.state.longitude !== null ? this.state.longitude : data.long.placeholder}</Text>
                </View>
                <View style={{ height: height(5.5), flex: 1, borderRadius: 3, borderColor: 'COLOR_GRAY', marginLeft: 2, borderWidth: 0.3, justifyContent: 'center', alignItems:'flex-start' }}>
                  <Text style={{ fontSize: totalSize(1.4), color: 'black', paddingHorizontal: 7 }}>{this.state.latitude !== null ? this.state.latitude : data.latt.placeholder}</Text>
                </View>
              </View>
            </View>
            {
              data.related.dropdown !== null ?
                <View style={styles.textInputCon}>
                  <Text style={styles.textInputLabel}>{data.related.main_title}</Text>
                  {
                    Platform.OS === 'android' ?
                      <View style={{ height: 45, width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                        <Picker
                          selectedValue={this.state.related_listing}
                          style={{ height: 45, width: width(88) }}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({ related_listing: itemValue })
                          }>
                          <Picker.Item label={data.related.placeholder} value='' />
                          {
                            data.related.dropdown.map((item, key) => {
                              return (
                                <Picker.Item key={key} label={item.listing_title} value={item.listing_id} />
                              );
                            })
                          }
                        </Picker>
                      </View>
                      :
                      <TouchableOpacity style={{ height: 50, width: width(90), alignItems: 'center', flexDirection: 'row', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                        <View style={{ width: width(78), alignItems:'flex-start' }}>
                          <Text style={{ marginHorizontal: 10 }}>{this.state.list_name.length !== 0 ? this.state.list_name : data.related.placeholder}</Text>
                        </View>
                        <Icon
                          size={14}
                          name='caretdown'
                          type='antdesign'
                          color='gray'
                        />
                      </TouchableOpacity>
                  }
                </View>
                :
                null
            }

            {
              store.settings.data.is_demo_mode ?
                <View style={[styles.profielBtn, { backgroundColor: store.settings.data.main_clr }]}>
                  <Text style={{ fontSize: totalSize(1.8), color: COLOR_PRIMARY, marginHorizontal: 15, marginVertical: 3, fontWeight: 'bold' }}>{store.settings.data.demo_mode_txt}</Text>
                </View>
                :
                this.state.loading ?
                  <View style={[styles.profielBtn, { backgroundColor: store.settings.data.main_clr, height: height(7) }]} >
                    <Progress.Circle size={40} indeterminate={false} showsText={true} textStyle={{ fontSize: 10 }} progress={this.state.progress} color={COLOR_PRIMARY} />
                  </View>
                  :
                  <TouchableOpacity style={[styles.profielBtn, { backgroundColor: store.settings.data.main_clr }]} onPress={() => {
                    if (params.eventMode === 'create') {
                      this.createEvent()
                    } else {
                      this.editEvent()
                    }
                  }}>
                    <Text style={styles.profielBtnTxt}>{params.eventMode === 'create' ? store.MY_EVENTS.data.create : store.MY_EVENTS.data.update_event}</Text>
                  </TouchableOpacity>
            }
          </View>
        </ScrollView>
        <Modal
          animationInTiming={500}
          animationIn="slideInUp"
          animationOut="slideOutDown"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.is_picker}
          onBackdropPress={() => this.setState({ is_picker: false })}
          style={{ flex: 1, marginTop: 275 }}>
          <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
            <View style={{ height: height(4), alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ is_picker: false }) }}>
                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={this.state.related_listing}
                style={{ height: 45, width: 370 }}
                onValueChange={async (itemValue, itemIndex) =>
                  await this.selectListing(itemValue, itemIndex)
                  // this.setState({ related_listing: itemValue })
                }>
                {
                  data.related.dropdown !== null ?
                    data.related.dropdown.map((item, key) => {
                      return (
                        <Picker.Item key={key} label={item.listing_title} value={item.listing_id} />
                      );
                    })
                    :
                    null
                }
              </Picker>
            </View>
          </View>
        </Modal>
        <Modal
          animationInTiming={500}    // Select category model
          animationIn="slideInUp"
          animationOut="slideOutDown"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.isCategory}
          onBackdropPress={() => this.setState({ isCategory: false })}
          style={{ flex: 1, marginTop: 275 }}>
          <View style={{ height: height(35), width: width(100), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
            <View style={{ height: height(4), alignItems: 'flex-end' }}>
              <TouchableOpacity style={{ elevation: 3, height: height(4), width: width(8), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ isCategory: false }) }}>
                <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1 }}>
              <Picker
                selectedValue={this.state.cate_id}
                style={{ height: 45, width: 370 }}
                onValueChange={async (itemValue, itemIndex) =>
                  await this.selectCategory(itemValue, itemIndex)
                }>
                {
                  data.category.dropdown.map((item, key) => {
                    return (
                      <Picker.Item key={key} label={item.category_name} value={item.category_id} />
                    );
                  })
                }
              </Picker>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
export default withNavigation(CreateEvent);
// <View style={{height:height(21),flexDirection:'column-reverse',borderRadius:5,marginBottom:10,borderColor: COLOR_GRAY,borderWidth:0.5}}>
//     <RichTextEditor
//         ref={(r)=>this.richtext = r}
//         style={{ alignItems:'center',justifyContent: 'center',backgroundColor: 'transparent',}}
//         hiddenTitle={true}
//         contentPlaceholder='Description'
//         customCSS = {'body {font-size: 12px;}'}
//         editorInitializedCallback={() => this.onEditorInitialized()}
//         />
//         <RichTextToolbar
//           getEditor={() => this.richtext}
//         />
// </View>