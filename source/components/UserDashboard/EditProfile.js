import React, { Component } from 'react';
import { Platform, Text, View, Image, TouchableOpacity, AsyncStorage, ScrollView, TextInput, Picker, ActivityIndicator } from 'react-native';
import Modal from "react-native-modal";
import { CheckBox, Icon } from 'react-native-elements'
// import {RichTextEditor, RichTextToolbar} from 'react-native-zss-rich-text-editor';
import { width, height, totalSize } from 'react-native-dimension';
import ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import Toast from 'react-native-simple-toast';
import ApiController from '../../ApiController/ApiController';
import { NavigationActions, StackActions, withNavigation } from 'react-navigation';
import { COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY } from '../../../styles/common';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import styles from '../../../styles/UserDashboardStyles/EditProfileStyleSheet';
import UpperView from './UpperView';
let _this = null;
// import { Icon } from 'react-native-paper/typings/components/List';
class EditProfile extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isPassChange: false,
      loading: false,
      newPass: '',
      confirmPass: '',
      name: '',
      email: '',
      phone: '',
      location: '',
      timezone: '',
      about: '',
      fbURL: '',
      twURL: '',
      inURL: '',
      youtubeURL: '',
      instaURL: '',
      hours_type_12: false,
      hours_type_24: false,
      my_hours_type: '',
      modalVisible: false,
      is_picker: false,
      progress: 0,
      avatarSource: null,
      image: null,
      pickerImage: false
    }
    // this.getHTML = this.getHTML.bind(this);
    // this.setFocusHandlers = this.setFocusHandlers.bind(this);
  }
  setModalVisible = async (visible) => {
    await this.setState({ modalVisible: visible })
  }

  static navigationOptions = { header: null };

  componentWillMount = async () => {
    _this = this;
    await this.getChangePassword()
    let data = store.USER_PROFILE.data.edit_profile;
    // Setting hours formate
    if (data.hours.value === '12') {
      this.setState({ hours_type_12: true, hours_type_24: false, my_hours_type: data.hours.value })
    } else {
      if (data.hours.value === '24') {
        this.setState({ hours_type_24: true, hours_type_12: false, my_hours_type: data.hours.value })
      }
    }
    await this.setState({
      name: data.title.value,
      email: data.email.value,
      phone: data.phone.value,
      location: data.location.value,
      timezone: data.timezone.value,
      about: data.about.value,
      timezone: data.timezone.value === '' ? data.timezone.placeholder : data.timezone.value,
      fbURL: data.fb.value,
      twURL: data.tw.value,
      inURL: data.in.value,
      youtubeURL: data.youtube.value,
      instaURL: data.insta.value
    });

  }
  imagePicker = () => {
    ImagePicker.openPicker({
      multiple: false,
      waitAnimationEnd: true,
      // includeExif: true,
      // forceJpg: true,
      compressImageQuality: 0.5
    }).then(async (image) => {
      var fileName = image.path.substring(image.path.lastIndexOf('/') + 1, image.path.length);
      await this.setState({
        avatarSource: { uri: image.path, type: image.mime, name: Platform.OS === 'ios' ? image.filename : fileName },
        image: { uri: image.path, width: image.width, height: image.height, mime: image.mime },
        pickerImage: true
      })
    }).catch((error) => {
      console.log('error:', error);
    });
  }
  clearFields = async () => {
    await this.setState({
      name: '',
      email: '',
      phone: '',
      location: '',
      about: '',
      description: '',
      timezone: '',
      end_date: '',
    })
  }
  hoursFormate = async (value) => {
    if (value === '12') {
      this.setState({ hours_type_12: true, hours_type_24: false, my_hours_type: value })
    } else {
      this.setState({ hours_type_24: true, hours_type_12: false, my_hours_type: value })
    }
  }
  editProfile = async () => {
    if (this.state.name === '' || this.state.email === '' || this.state.phone === '' || this.state.location === '' || this.state.about === '' || this.state.timezone === '') {
      Toast.show('Some required fields are missing')
    } else {
      this.setState({ loading: true })
      let formData = new FormData();
      formData.append('name', this.state.name);
      // formData.append('email', this.state.email);
      formData.append('phone', this.state.phone);
      formData.append('location', this.state.location);
      formData.append('about', this.state.about);
      formData.append('timezone', this.state.timezone);
      formData.append('my_hours_type', this.state.my_hours_type);
      formData.append('fb', this.state.fbURL);
      formData.append('tw', this.state.twURL);
      formData.append('in', this.state.inURL);
      formData.append('youtube', this.state.youtubeURL);
      formData.append('insta', this.state.instaURL);
      if (this.state.avatarSource !== null) {
        formData.append('user_dp', this.state.avatarSource);
      }

      // console.log('formData======>>>', formData);
      let config = {
        onUploadProgress: async function (progressEvent) {
          this.setState({ progress: progressEvent.loaded / progressEvent.total })
          //console.log('uploading', this.state.progress);
        }.bind(this)
      }
      //ApiController 
      try {
        ApiController.postAxios('profile-edit', formData, config)
          .then(async (response) => {
            // console.log('profile edit========>>>>', response);
            if (response.data.success) {
              store.login.loginResponse.data.display_name = response.data.data.display_name;
              store.login.loginResponse.data.profile_img = response.data.data.profile_img;
              Toast.show(response.data.message)
              // await this.clearFields()
              // this.props.navigation.push('EventDetail', { event_id: response.data.event_id, title: this.state.eventTitle, headerColor: store.settings.data.navbar_clr })
              this.setState({ loading: false })
            } else {
              Toast.show(response.data.message);
              this.setState({ loading: false, progress: 0 })
            }
          }).catch((error) => {
            // console.log('axios error==>>', error);
            this.setState({ loading: false })
          })
      } catch (error) {
        console.log('trycatch error==>>', error);
      }
    }
  }
  getChangePassword = async () => {
    this.setState({ isPassChange: true })
    let res = await ApiController.get('change-password');
    // console.log('password change get===>>>', res);
    try {
      if (res.success) {
        store.CHANGE_PASS = res.data;
      }
      this.setState({ isPassChange: false })
    } catch (error) {
      console.log('errorCatch==>>>', error);
      this.setState({ isPassChange: false })
    }
  }
  postChangePassword = async () => {
    this.setState({ isPassChange: true })
    let params = {
      new_password: this.state.newPass,
      confirm_password: this.state.confirmPass
    };
    let response = await ApiController.post('change-password', params);
    console.log('password change post===>>>', response);
    try {
      if (response.success) {
        Toast.show(response.message, Toast.LONG);
        await this.asyncDelUserInfo()
        await this.setState({ modalVisible: false, isPassChange: false })
      } else {
        Toast.show(response.message);
        await this.setState({ isPassChange: false })
      }
    } catch (error) {
      //console.log('errorCatch==>>>', error);
      await this.setState({ modalVisible: false, isPassChange: false })
    }
  }
  asyncDelUserInfo = async () => {
    console.warn('logout');
    try {
      const email = await AsyncStorage.removeItem('email');
      const password = await AsyncStorage.removeItem('password');
      const data = await AsyncStorage.removeItem('profile');
      console.warn('logout=>', email, password, data);
      store.login.loginStatus = false;
      await this.reset()
      // this.props.navigation.replace('MainScreen')
    } catch (error) {
      // Error saving data
    }
    // BackHandler.exitApp();
  }
  reset() {
    return this.props
      .navigation
      .dispatch(StackActions.reset(
        {
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'SignIn' })
          ]
        }));
  }
  render() {
    let data = store.USER_PROFILE.data.edit_profile;
    let main_clr = store.settings.data.main_clr;
    return (
      <View style={styles.container}>
        <ScrollView>
          <UpperView status={true} image={this.state.image} pickerImage={this.state.pickerImage} _imagePicker={this.imagePicker} />
          <View style={styles.titleCon}>
            <View style={{ width:width(61), alignItems:'flex-start' }}>
              <Text style={styles.titleTxt}>{store.USER_PROFILE.data.page_title_edit}</Text>
            </View>
            <TouchableOpacity style={styles.changeBtnCon} onPress={() => this.setState({ modalVisible: true }) }>
              <Text style={styles.closeBtnTxt}>{store.USER_PROFILE.extra_text.forget_pass}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.title.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              onChangeText={(value) => this.setState({ name: value })}
              placeholder={data.title.placeholder}
              placeholderTextColor='gray'
              value={data.title.value !== "" ? this.state.name : null}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.email.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              onChangeText={(value) => this.setState({ email: value })}
              placeholder={data.email.placeholder}
              editable={false}
              placeholderTextColor='gray'
              value={data.email.value !== "" ? this.state.email : null}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.phone.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              onChangeText={(value) => this.setState({ phone: value })}
              placeholder={data.phone.placeholder}
              placeholderTextColor='gray'
              value={data.phone.value !== "" ? this.state.phone : null}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={styles.textInputCon}>
            <Text style={styles.textInputLabel}>{data.location.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              onChangeText={(value) => this.setState({ location: value })}
              placeholder={data.location.placeholder}
              placeholderTextColor='gray'
              value={data.location.value !== "" ? this.state.location : null}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={styles.textInput}
            />
          </View>
          <View style={{ width: width(92), alignSelf: 'center', marginTop: 5, alignItems:'flex-start' }}>
            <Text style={{ fontSize: 15, color: COLOR_SECONDARY }}>{data.hours.main_title}</Text>
            <View style={{ flexDirection: 'row', alignItems:'flex-start' }}>
              <CheckBox
                center
                title={data.hours.dropdown[0].text}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor={main_clr}
                checked={this.state.hours_type_12}
                onPress={() => _this.hoursFormate('12')}
                containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent', marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0 }}
              />
              <CheckBox
                center
                title={data.hours.dropdown[1].text}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checkedColor={main_clr}
                checked={this.state.hours_type_24}
                onPress={() => _this.hoursFormate('24')}
                containerStyle={{ backgroundColor: 'transparent', borderColor: 'transparent', marginLeft: 0, marginRight: 0, marginTop: 0, marginBottom: 0 }}
              />
            </View>
          </View>
          <View style={[styles.textInputCon, { marginVertical: 0 }]}>
            <Text style={styles.textInputLabel}>{data.timezone.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
            {
              Platform.OS === 'android' ?
                <View style={{ height: 45, width: width(90), flexDirection: 'row', alignItems: 'center', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }}>
                  <Picker
                    selectedValue={this.state.timezone}
                    style={{ height: 45, width: width(90) }}
                    onValueChange={(itemValue, itemIndex) =>
                      this.setState({ timezone: itemValue })
                    }>
                    <Picker.Item label={data.timezone.placeholder} />
                    {
                      store.TIME_ZONE.map((item, key) => {
                        return (
                          <Picker.Item key={key} label={item} value={item} />
                        );
                      })
                    }
                  </Picker>
                </View>
                :
                <TouchableOpacity style={{ height: 45, width: width(92), alignItems: 'center', flexDirection: 'row', borderWidth: 0.4, borderColor: '#8a8a8a', borderRadius: 5 }} onPress={() => this.setState({ is_picker: !this.state.is_picker })}>
                  <View style={{ alignItems:'flex-start', width: width(85) }}>
                    <Text style={{ marginHorizontal: 8 }}>{this.state.timezone}</Text>
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
          <View style={styles.aboutInputCon}>
            <Text style={styles.textInputLabel}>{data.about.main_title}<Text style={{ color: 'red' }}>*</Text></Text>
            <TextInput
              onChangeText={(value) => this.setState({ about: value })}
              placeholder={data.about.placeholder}
              placeholderTextColor='gray'
              multiline={true}
              value={data.about.value !== "" ? this.state.about : null}
              underlineColorAndroid='transparent'
              autoCorrect={false}
              style={styles.aboutInputText}
            />
          </View>
          <View style={{ marginHorizontal: 15, marginTop: 15, flexDirection: 'column' }}>
            <View style={{ width: width(92), height: height(6), backgroundColor: 'rgba(220,220,220,0.5)', marginBottom: 5, flexDirection: 'row' }}>
              <Icon
                size={18}
                containerStyle={{ height: height(6), width: width(12), alignItems: 'center', justifyContent: 'center' }}
                name='facebook'
                type='font-awesome'
                color='rgba(0,0,0,0.7)'
              />
              <View style={{ height: height(5.6), width: width(79.5), backgroundColor: '#fff', justifyContent: 'center', alignSelf: 'center' }}>
                <TextInput
                  onChangeText={(value) => this.setState({ fbURL: value })}
                  placeholder={data.fb.placeholder}
                  placeholderTextColor='gray'
                  multiline={true}
                  value={data.fb.value !== "" ? this.state.fbURL : null}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  style={styles.socialInput}
                />
              </View>
            </View>
            <View style={{ width: width(92), height: height(6), backgroundColor: 'rgba(220,220,220,0.5)', marginTop: 5, flexDirection: 'row' }}>
              <Icon
                size={18}
                containerStyle={{ height: height(6), width: width(12), alignItems: 'center', justifyContent: 'center' }}
                name='twitter'
                type='feather'
                color='rgba(0,0,0,0.7)'
              />
              <View style={{ height: height(5.6), width: width(79.5), backgroundColor: '#fff', justifyContent: 'center', alignSelf: 'center' }}>
                <TextInput
                  onChangeText={(value) => this.setState({ twURL: value })}
                  placeholder={data.tw.placeholder}
                  placeholderTextColor='gray'
                  multiline={true}
                  value={data.tw.value !== "" ? this.state.twURL : null}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  style={styles.socialInput}
                />
              </View>
            </View>
            <View style={{ width: width(92), height: height(6), backgroundColor: 'rgba(220,220,220,0.5)', marginTop: 10, flexDirection: 'row' }}>
              <Icon
                size={18}
                containerStyle={{ height: height(6), width: width(12), alignItems: 'center', justifyContent: 'center' }}
                name='linkedin'
                type='entypo'
                color='rgba(0,0,0,0.7)'
              />
              <View style={{ height: height(5.6), width: width(79.5), backgroundColor: '#fff', justifyContent: 'center', alignSelf: 'center' }}>
                <TextInput
                  onChangeText={(value) => this.setState({ inURL: value })}
                  placeholder={data.in.placeholder}
                  placeholderTextColor='gray'
                  multiline={true}
                  value={data.in.value !== "" ? this.state.inURL : null}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  style={styles.socialInput}
                />
              </View>
            </View>
            <View style={{ width: width(92), height: height(6), backgroundColor: 'rgba(220,220,220,0.5)', marginTop: 10, flexDirection: 'row' }}>
              <Icon
                size={18}
                containerStyle={{ height: height(6), width: width(12), alignItems: 'center', justifyContent: 'center' }}
                name='youtube'
                type='font-awesome'
                color='rgba(0,0,0,0.7)'
              />
              <View style={{ height: height(5.6), width: width(79.5), backgroundColor: '#fff', justifyContent: 'center', alignSelf: 'center' }}>
                <TextInput
                  onChangeText={(value) => this.setState({ youtubeURL: value })}
                  placeholder={data.youtube.placeholder}
                  placeholderTextColor='gray'
                  multiline={true}
                  value={data.youtube.value !== "" ? this.state.youtubeURL : null}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  style={styles.socialInput}
                />
              </View>
            </View>
            <View style={{ width: width(92), height: height(6), backgroundColor: 'rgba(220,220,220,0.5)', marginTop: 10, flexDirection: 'row' }}>
              <Icon
                size={18}
                containerStyle={{ height: height(6), width: width(12), alignItems: 'center', justifyContent: 'center' }}
                name='instagram'
                type='font-awesome'
                color='rgba(0,0,0,0.7)'
              />
              <View style={{ height: height(5.6), width: width(79.5), backgroundColor: '#fff', justifyContent: 'center', alignSelf: 'center' }}>
                <TextInput
                  onChangeText={(value) => this.setState({ instaURL: value })}
                  placeholder={data.insta.placeholder}
                  placeholderTextColor='gray'
                  multiline={true}
                  value={data.insta.value !== "" ? this.state.instaURL : null}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  style={styles.socialInput}
                />
              </View>
            </View>
          </View>

          {
            store.settings.data.is_demo_mode ?
              <View style={[styles.profielBtn, { backgroundColor: store.settings.data.main_clr }]}>
                <Text style={{ fontSize: totalSize(1.8), color: COLOR_PRIMARY, marginHorizontal: 0, marginVertical: 3, fontWeight: 'bold' }}>{store.settings.data.demo_mode_txt}</Text>
              </View>
              :
              this.state.loading ?
                <View style={[styles.profielBtn, { backgroundColor: store.settings.data.main_clr, height: height(7) }]} >
                  <Progress.Circle size={40} indeterminate={false} showsText={true} textStyle={{ fontSize: 10 }} progress={this.state.progress} color={COLOR_PRIMARY} />
                </View>
                :
                <TouchableOpacity style={[styles.profielBtn, { backgroundColor: main_clr }]} onPress={() => this.editProfile()}>
                  <Text style={styles.profielBtnTxt}>{store.USER_PROFILE.extra_text.profile_edit_btn}</Text>
                </TouchableOpacity>
          }
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
                selectedValue={this.state.timezone}
                style={{ height: 45, width: 370 }}
                onValueChange={(itemValue, itemIndex) =>
                  this.setState({ timezone: itemValue })
                }>
                {
                  store.TIME_ZONE.map((item, key) => {
                    return (
                      <Picker.Item key={key} label={item} value={item} />
                    );
                  })
                }
              </Picker>
            </View>
          </View>
        </Modal>
        <Modal
          animationInTiming={500}
          animationIn="slideInLeft"
          animationOut="slideOutRight"
          avoidKeyboard={true}
          // transparent={false}
          isVisible={this.state.modalVisible}
          onBackdropPress={() => this.setState({ modalVisible: false })}
          style={{ flex: 1 }}>
          {
            this.state.isPassChange ?
              <ActivityIndicator color={main_clr} animating={true} size='large' />
              :
              <View style={{ height: height(33), width: width(90), alignSelf: 'center', backgroundColor: COLOR_PRIMARY }}>
                <View style={{ height: height(4), alignItems: 'flex-end' }}>
                  <TouchableOpacity style={{ elevation: 3, height: height(3.5), width: width(6), justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }} onPress={() => { this.setState({ modalVisible: false }) }}>
                    <Image source={require('../../images/clear-button.png')} style={{ height: height(2), width: width(3), resizeMode: 'contain' }} />
                  </TouchableOpacity>
                </View>
                <Text style={{ fontSize: totalSize(1.8), color: 'black', marginVertical: 10, marginHorizontal: 20, fontWeight: 'bold' }}>{store.CHANGE_PASS.heading}</Text>
                <TextInput
                  onChangeText={(value) => this.setState({ newPass: value })}
                  placeholder={store.CHANGE_PASS.change_password[0].placeholder}
                  placeholderTextColor={COLOR_GRAY}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  style={{ height: height(6), marginHorizontal: 20, padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLOR_GRAY, backgroundColor: COLOR_PRIMARY, color: COLOR_SECONDARY, fontSize: totalSize(1.6) }}
                />
                <TextInput
                  onChangeText={(value) => this.setState({ confirmPass: value })}
                  placeholder={store.CHANGE_PASS.change_password[1].placeholder}
                  placeholderTextColor={COLOR_GRAY}
                  underlineColorAndroid='transparent'
                  autoCorrect={false}
                  style={{ height: height(6), marginHorizontal: 20, padding: 10, marginBottom: 10, borderRadius: 5, borderWidth: 0.5, borderColor: COLOR_GRAY, backgroundColor: COLOR_PRIMARY, color: COLOR_SECONDARY, fontSize: totalSize(1.6) }}
                />
                <TouchableOpacity style={{ elevation: 3, height: height(6), justifyContent: 'center', alignItems: 'center', borderRadius: 5, marginVertical: 5, marginHorizontal: 20, backgroundColor: main_clr }} onPress={() => { this.postChangePassword() }}>
                  <Text style={{ fontSize: totalSize(1.8), color: COLOR_PRIMARY, fontWeight: 'bold' }}>{store.CHANGE_PASS.btn_text}</Text>
                </TouchableOpacity>
              </View>
          }
        </Modal>
      </View>
    );
  }
}
export default withNavigation(EditProfile);
// onEditorInitialized() {
//   this.setFocusHandlers();
//   this.getHTML();
// }
// async getHTML() {
//   const titleHtml = await this.richtext.getTitleHtml();
//   const contentHtml = await this.richtext.getContentHtml();
//   //alert(titleHtml + ' ' + contentHtml)
// }
// setFocusHandlers() {
//   this.richtext.setTitleFocusHandler(() => {
//     //alert('title focus');
//   });
//   this.richtext.setContentFocusHandler(() => {
//     //alert('content focus');
//   });
//  }
// <View style={{height:height(21),flexDirection:'column-reverse',borderRadius:5,marginBottom:10,borderColor: COLOR_GRAY,borderWidth:0.5}}>
//   <RichTextEditor
//       ref={(r)=>this.richtext = r}
//       style={{ alignItems:'center',justifyContent: 'center',backgroundColor: 'transparent',}}
//       hiddenTitle={true}
//       contentPlaceholder='Description'
//       customCSS = {'body {font-size: 12px;}'}
//       editorInitializedCallback={() => this.onEditorInitialized()}
//       />
//       <RichTextToolbar
//         getEditor={() => this.richtext}
//       />
// </View>
