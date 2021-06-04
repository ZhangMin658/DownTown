import React, { Component } from 'react';
import {
  Text, View, Button, Image,I18nManager, ImageBackground, TouchableOpacity, ActivityIndicator, TextInput
} from 'react-native';
import { INDICATOR_COLOR, INDICATOR_SIZE, INDICATOR_VISIBILITY, OVERLAY_COLOR, TEXT_SIZE, TEXT_COLOR, ANIMATION } from '../../../styles/common';
import Icon from 'react-native-vector-icons/Octicons';
import { width, height, totalSize } from 'react-native-dimension';
import Toast from 'react-native-simple-toast';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import Store from '../../Stores';
import styles from '../../../styles/ForgetPasswordStyle';
import ApiController from '../../ApiController/ApiController';
@observer export default class ForgetPassword extends Component<Props> {
  constructor(props) {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    super(props);
    this.state = {
      loading: false,
      email: '',
    }
  }
  static navigationOptions = {
    header: null
  };
  forget = async () => {
    if (this.state.email.length === 0) {
      Toast.show('Please enter your email');
    } else {
      this.setState({ loading: true })
      let params = {
        email: this.state.email,
      }
      let response = await ApiController.post('forgot', params)
      // console.log('forget password =',response);
      if (response.success === true) {
        this.setState({ loading: false })
        this.props.navigation.navigate('SignIn')
      } else {
        this.setState({ loading: false })
        Toast.show(response.message);
      }
    }
  }
  render() {
    let { orderStore } = Store;
    let data = orderStore.settings.data;

    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../images/bk_ground.jpg')} style={styles.imgCon}>
          <ImageBackground source={require('../../images/Downtown_Shadownew.png')} style={styles.imgCon}>
            <View style={{ height: height(5), flexDirection: 'row' }}>
              <TouchableOpacity style={styles.bckImgCon} onPress={() => this.props.navigation.goBack()}>
                <Image source={require('../../images/back_btn.png')} style={styles.backBtn} />
              </TouchableOpacity>
              <View style={{ flex: 0.5, justifyContent: 'flex-end', marginHorizontal: 10 }}>
                <Text style={styles.headerTxt}>{data.main_screen.reset_btn}</Text>
              </View>
            </View>
            <View style={styles.logoView}>
              <Image source={{ uri: data.logo }} style={styles.logoImg} />
              <Text style={styles.logoTxt}>{data.slogan}</Text>
            </View>
            <View style={styles.buttonView}>
              <View style={styles.btn} onPress={() => { this.props.navigation.navigate('Login') }}>
                <View style={{ marginHorizontal: 10 }}>
                  {/* <Image source={require('../../images/mail.png')} style={styles.mail} /> */}
                  <Icon name='mail' color='white' size={24} />  
                </View>
                <View style={{ flex: 4.1 }}>
                  <TextInput
                    onChangeText={(value) => this.setState({ email: value })}
                    underlineColorAndroid='transparent'
                    placeholder={data.main_screen.email_placeholder}
                    secureTextEntry={true}
                    placeholderTextColor='white'
                    keyboardType='email-address'
                    underlineColorAndroid='transparent'
                    autoCorrect={true}
                    style={[styles.inputTxt,{textAlign: I18nManager.isRTL ? 'right' : 'left'}]}
                  />
                </View>
              </View>
              <TouchableOpacity style={[styles.signUpBtn, { backgroundColor: orderStore.settings.data.main_clr }]} onPress={() => this.forget()}>
                <Text style={styles.signUpTxt}>{data.main_screen.reset_btn}</Text>
              </TouchableOpacity>
              <View style={{ height:height(30),width:width(90),justifyContent:'center',alignItems:'center' }}>
                  {
                    this.state.loading?
                      <ActivityIndicator color= {store.settings.data.navbar_clr} size='large' animating={true} />
                      :
                      null
                  }
              </View>
            </View>
            <View style={styles.footer}>
              <Text style={styles.expTxt}>{data.main_screen.already_account} </Text>
              <Text style={styles.signUpT} onPress={() => this.props.navigation.navigate('SignIn')}>{data.main_screen.sign_in}</Text>
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  }
}
