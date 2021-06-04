import React, { Component } from 'react';
import {
  Platform, StyleSheet, Text, View, ActivityIndicator, Button, Image, 
  RefreshControl,
  ImageBackground, TouchableOpacity, I18nManager,
  ScrollView, TextInput, FlatList
} from 'react-native';
import { width, height, totalSize } from 'react-native-dimension';
import { FONT_BOLD, COLOR_PRIMARY, COLOR_ORANGE, COLOR_GRAY, COLOR_SECONDARY, COLOR_YELLOW, COLOR_TRANSPARENT_BLACK } from '../../../styles/common';
import { observer } from 'mobx-react';
import styles from '../../../styles/ContactUs';
const subHeadingTxt = 1.5;
const titles = 1.8;
import Toast from 'react-native-simple-toast'




import store from '../../Stores/orderStore'
import ApiController from '../../ApiController/ApiController';
import { widthPercentageToDP as wp, heightPercentageToDP } from '../../helpers/Responsive';


@observer
export default class ContactUs extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      number: '',
      subject: '',
      msg: '',


      nameB: false,
      emailB: false,
      numberB: false,
      subjectB: false,
      msgB: false,

      formSubmitted: false,

    }
    // I18nManager.forceRTL(false);
  }
  static navigationOptions = {
    header: null,
  };


  componentWillMount = async () => {

    this.setState({ loading: true })
    let response = await ApiController.post('contactus');
    if (response.success) {
      store.ContactUs = response.data;
      if (response.data.contact_us.required.name) {
        this.setState({ nameB: true })
      }
      if (response.data.contact_us.required.number) {
        this.setState({ numberB: true })
      }
      if (response.data.contact_us.required.msg) {
        this.setState({ msgB: true })

      }
      if (response.data.contact_us.required.email) {
        this.setState({ emailB: true })
      }
      if (response.data.contact_us.required.subject) {
        this.setState({ subjectB: true })

      }


      this.setState({ loading: false })
    } else {
      this.setState({ loading: false })
    }

  }

  validate = () => {
    if ((this.state.emailB && this.state.email == '') || (this.state.nameB && this.state.name == '')
      || (this.state.msgB && this.state.msg == '') || (this.state.numberB && this.state.number == '')
      || (this.state.subjectB && this.state.subject == '')
    ) {
      this.setState({ formSubmitted: true })
      Toast.show(store.ContactUs.contact_us.heading.app_contact_form_validaton)
      return false
    }
    return true
  }

  submitForm = async () => {
    let isValidate = this.validate()
    if (isValidate) {
      this.setState({ loading: true })
      let param = {
        name: this.state.name,
        subject: this.state.subject,
        email: this.state.email,
        number: this.state.number,
        msg: this.state.msg
      }
      let response = await ApiController.post('contact-submit', param);
      if (response.success) {
        Toast.show(response.message)

        // store.ContactUs = response.data;
        this.setState({
          loading: false, formSubmitted: false, name: '',
          email: '',
          number: '',
          subject: '',
          msg: ''
        })
      } else {
        this.setState({ loading: false })
      }
    } else {
      Toast.show(response.message)

    }


  }

  refreshPage = async () => {
    this.setState({ loading: true })
    let response = await ApiController.post('contactus');
    if (response.success) {
      store.ContactUs = response.data;
      if (response.data.contact_us.required.name) {
        this.setState({ nameB: true })
      }else{
        this.setState({ nameB: false })

      }
      if (response.data.contact_us.required.number) {
        this.setState({ numberB: true })
      }else{
        this.setState({ numberB: false })

      }
      if (response.data.contact_us.required.msg) {
        this.setState({ msgB: true })
      }else{
        this.setState({ msgB: false })

      }
      if (response.data.contact_us.required.email) {
        this.setState({ emailB: true })
      }else{
        this.setState({ emailB: false })

      }
      if (response.data.contact_us.required.subject) {
        this.setState({ subjectB: true })

      }else{
        this.setState({ subjectB: false })
        
      }

      this.setState({ loading: false,formSubmitted:false })
    } else {
      this.setState({ loading: false })
    }
  }
  render() {
    let main_clr = store.settings.data.main_clr;

    return (
      this.state.loading ? [
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' color={main_clr} animating={true} />
        </View>
      ]
        :
        // null
        <View style={styles.container}>
          <ImageBackground source={require('../../images/bk_ground.jpg')} style={{ flex: 1, alignSelf: 'stretch' }}>
            <ScrollView

              refreshControl={
                <RefreshControl
                  colors={['white']}
                  progressBackgroundColor={store.settings.data.main_clr}
                  tintColor={store.settings.data.main_clr}
                  refreshing={this.state.refreshing}
                  onRefresh={this.refreshPage}
                />
              }>
              <View style={{ height: heightPercentageToDP(88), backgroundColor: COLOR_TRANSPARENT_BLACK, alignItems: 'center' }}>
                <View style={{ height: height(20), width: width(100) }}>
                  <Text style={[styles.logoTxt, { width: wp('100'), height: wp('10'), fontWeight: '800', marginTop: wp('10') }]}>{store.ContactUs.contact_us.form.app_contact_us_form_title}</Text>

                  <Text style={[styles.logoTxt, { width: wp('100'), fontSize: totalSize(1.8) }]}>{store.ContactUs.contact_us.form.app_contact_us_form_subline}</Text>

                  {/* <View style={styles.logoView}>
                  <Image source={require('../../images/mainscr_logo.png')} style={styles.logoImg}/>
                  <Text style={styles.logoTxt}>Find and Explore World top Places</Text>
                </View> */}
                </View>
                <View style={{ height: height(50), width: width(95) }}>
                  {/* <View style={{ height: height(5), width: width(23), borderBottomWidth: 1, borderColor: COLOR_ORANGE, marginVertical: 5, justifyContent: 'center' }}>
                    <Text style={{ fontSize: totalSize(titles), fontWeight: 'bold', color: COLOR_PRIMARY }}>Get In Touch:</Text>
                  </View> */}

                  <View style={{ height: height(6), marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      onChangeText={(value) => this.setState({ name: value, formSubmitted: false })}
                      underlineColorAndroid='transparent'
                      // placeholder='أدخل كلمة المرور'
                      placeholder={store.ContactUs.contact_us.required.name ? store.ContactUs.contact_us.heading.app_contact_us_name_title + " *" : store.ContactUs.contact_us.heading.app_contact_us_name_title}
                      placeholderTextColor='white'
                      underlineColorAndroid='transparent'
                      autoCorrect={false}
                      style={[I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'},      this.state.formSubmitted && this.state.nameB && this.state.name == '' ? { height: height(6), width: width(45), marginRight: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'red', borderWidth: 1, borderRadius: 3 } : { height: height(6), width: width(45), marginRight: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'gray', borderWidth: 1, borderRadius: 3 }]}
                    />
                    <TextInput
                      onChangeText={(value) => this.setState({ email: value, formSubmitted: false })}
                      underlineColorAndroid='transparent'
                      // placeholder='أدخل كلمة المرور'
                      placeholder={store.ContactUs.contact_us.required.email ? store.ContactUs.contact_us.heading.app_contact_us_email_title + " *" : store.ContactUs.contact_us.heading.app_contact_us_email_title}
                      // placeholder={store.ContactUs.contact_us.heading.app_contact_us_email_title}
                      placeholderTextColor='white'
                      underlineColorAndroid='transparent'
                      autoCorrect={false}
                      style={[I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'},this.state.formSubmitted && this.state.emailB && this.state.email == '' ? { height: height(6), width: width(45), marginLeft: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'red', borderWidth: 1, borderRadius: 3 } : { height: height(6), width: width(45), marginLeft: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'gray', borderWidth: 1, borderRadius: 3 }]}
                    />
                  </View>
                  <View style={{ height: height(6), marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      onChangeText={(value) => this.setState({ number: value, formSubmitted: false })}
                      underlineColorAndroid='transparent'
                      // placeholder='أدخل كلمة المرور'
                      placeholder={store.ContactUs.contact_us.required.number ? store.ContactUs.contact_us.heading.app_contact_us_contact_no_title + " *" : store.ContactUs.contact_us.heading.app_contact_us_contact_no_title}
                      placeholderTextColor='white'
                      underlineColorAndroid='transparent'
                      autoCorrect={false}
                      style={[I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'},this.state.formSubmitted && this.state.numberB && this.state.number == '' ? { height: height(6), width: width(45), marginRight: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'red', borderWidth: 1, borderRadius: 3 } : { height: height(6), width: width(45), marginRight: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'gray', borderWidth: 1, borderRadius: 3 }]}
                    />
                    <TextInput
                      onChangeText={(value) => this.setState({ subject: value, formSubmitted: false })}
                      underlineColorAndroid='transparent'
                      // placeholder='أدخل كلمة المرور'
                      placeholder={store.ContactUs.contact_us.required.subject ? store.ContactUs.contact_us.heading.app_contact_us_subject_title + " *" : store.ContactUs.contact_us.heading.app_contact_us_subject_title}
                      placeholderTextColor='white'
                      underlineColorAndroid='transparent'
                      autoCorrect={false}
                      style={[I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'},this.state.formSubmitted && this.state.subjectB && this.state.subject == '' ? { height: height(6), width: width(45), marginLeft: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'red', borderWidth: 1, borderRadius: 3 } : { height: height(6), width: width(45), marginLeft: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'gray', borderWidth: 1, borderRadius: 3 }]}
                    />
                  </View>
                  <View style={{ height: height(12), marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <TextInput
                      onChangeText={(value) => this.setState({ msg: value, formSubmitted: false })}
                      underlineColorAndroid='transparent'
                      // placeholder='أدخل كلمة المرور'
                      placeholder={store.ContactUs.contact_us.required.msg ? store.ContactUs.contact_us.heading.app_contact_us_mesage_title + " *" : store.ContactUs.contact_us.heading.app_contact_us_mesage_title}
                      placeholderTextColor='white'
                      underlineColorAndroid='transparent'
                      autoCorrect={false}
                      style={[I18nManager.isRTL?{textAlign:'right'}:{textAlign:'left'},this.state.formSubmitted && this.state.msgB && this.state.msg == '' ? { alignSelf: 'stretch', width: width(95), marginRight: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'red', borderWidth: 1, borderRadius: 3 } : { alignSelf: 'stretch', width: width(95), marginRight: 10, backgroundColor: 'rgba(211,211,211,0.3)', paddingLeft: 10, color: COLOR_PRIMARY, fontSize: totalSize(subHeadingTxt), borderColor: 'gray', borderWidth: 1, borderRadius: 3 }]}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() => this.submitForm()}
                    style={{ height: height(6), marginVertical: 5, backgroundColor: main_clr, borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: totalSize(1.4), fontFamily: FONT_BOLD, color: COLOR_PRIMARY }}>{store.ContactUs.contact_us.heading.btn_submit}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </ImageBackground>
        </View>
    );
  }
}
