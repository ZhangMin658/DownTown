import React, { Component } from 'react';
import {
  Platform, ActivityIndicator, Text, View, AsyncStorage, Image, ImageBackground, TouchableOpacity, I18nManager,
  TextInput, Alert,Linking
} from 'react-native';

import { INDICATOR_COLOR, INDICATOR_SIZE, OVERLAY_COLOR, COLOR_PRIMARY } from '../../../styles/common';
import { width, height, totalSize } from 'react-native-dimension';
import Toast from 'react-native-simple-toast';
import Icon from 'react-native-vector-icons/Octicons';
import IconLock from 'react-native-vector-icons/SimpleLineIcons';
import Feather from 'react-native-vector-icons/Feather';
import { observer } from 'mobx-react';
import store from '../../Stores/orderStore';
import Store from '../../Stores';
import styles from '../../../styles/SignIn'
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import ApiController from '../../ApiController/ApiController';
import LocalDB from '../../LocalDB/LocalDB'
import Storage from '../../LocalDB/storage'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';

import  firebase  from 'react-native-firebase';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';
import { widthPercentageToDP as wp } from '../../helpers/Responsive'




export default class SignIn extends Component<Props> {
  constructor(props) {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    super(props);
    this.state = {
      loading: false,
      password: '',//12345
      email: '',//usama@gmail.com
      pass_show: false,
    }
  }
  static navigationOptions = {
    header: null
  };
  componentWillMount = async () => {
    GoogleSignin.configure({
      iosClientId: '191792720370-rc4ospf26req749phf3d4l4sfj74gmf4.apps.googleusercontent.com'
    })
  }
  //// Google Login Methode 
  handleGoogleSignIn = async () => {
    
    console.log('Google login');
    GoogleSignin.signIn().then(fun = async (user) => {
      console.log('Google login', user);
      //Calling local func for login through google
      store.LOGIN_SOCIAL_TYPE = 'social';
      store.LOGIN_TYPE = 'google';
      await this.socialLogin(user.user.email, user.user.name, 'apple@321');
    }).catch((err) => {
      console.warn(err);
    }).done();
  }
  fbsdk = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      functionFun = (result) => {
        if (result.isCancelled) {
          Toast.show('It must be your network issue, please try again.', Toast.LONG);
        } else {
          const infoRequest = new GraphRequest(
            '/me?fields=id,first_name,last_name,name,picture.type(large),email,gender',
            null,
            this._responseInfoCallback,
          );
          new GraphRequestManager().addRequest(infoRequest).start();
        }
      },
      function (error) {
        Toast.show('It must be your network issue, please try again.', Toast.LONG);
        // console.log("Login fail with error: " + error);
      }
    );
  }
  //Create response callback.
  _responseInfoCallback = async (error: ?Object, result: ?Object) => {
    if (error) {
      // console.log('Error fetching data: ' + error.toString());
    } else {
      store.LOGIN_SOCIAL_TYPE = 'social';
      store.LOGIN_TYPE = 'facebook';
      await this.socialLogin(result.email, result.name, 'apple@321');
      // console.log('Success fetching data: ', result);
    }
  }
  //// Custom Social Login methode
  socialLogin = async (email, name, password) => {
    console.log('email',email)
    console.log('pass',password)
    console.log('name',name)
    // if (this.state.email.length > 0 && this.state.password.length > 0) {
    var Email, Password;
    // Email = this.state.email;
    // Password = this.state.password;
    // } else {
    Email = email;
    Password = password;
    // }
    let { orderStore } = Store;
    this.setState({ loading: true })
    let params = {
      name: name,
      email: email,
      type: 'social'
    }
    //API Calling

    let response = await ApiController.post('login', params)
    // console.log('login user =', response);
    if (response.success === true) {
      // Storage.setItem('email', Email)
      // Storage.setItem('password', Password)
      await LocalDB.saveProfile(Email, Password, response.data);

      Storage.setItem('issocial', true)


      let responseSetting = await ApiController.post('settings')

      orderStore.settings = responseSetting;
      if (orderStore.settings.success === true) {

        orderStore.statusbar_color = orderStore.settings.data.navbar_clr;
        orderStore.wpml_settings = orderStore.settings.data.wpml_settings
   
      }


      this.setState({ loading: false })
      orderStore.login.loginStatus = true;
      orderStore.login.loginResponse = response;
      this.props.navigation.push('Drawer')
    }else{
      this.setState({ loading: false })

    }
  }
  validate = () => {
    let { orderStore } = Store;

    if (this.state.email == '' || this.state.password == '') {
      Toast.show(orderStore.settings.data.main_screen.validation);
      return false
    }
    else if (this.state.term_checked == false)
    {
      return false
    }
    return true
  }
  //// Login Post 
  login = async () => {
    let isValid = this.validate()
    // console.log('is ',isValid)
    if (isValid==true) {
      let { orderStore } = Store;
      this.setState({ loading: true })
      let params = {
        email: this.state.email,
        password: this.state.password
      }
      //Api calling
      let response = await ApiController.post('login', params)
      console.log('login user =', response);
      if (response.success === true) {
        store.LOGIN_TYPE = 'local';
        Storage.setItem('email', this.state.email)
        Storage.setItem('password', this.state.password)
        Storage.setItem('issocial', false)

        await LocalDB.saveProfile(this.state.email, this.state.password, response.data);

       


        orderStore.login.loginStatus = true;
        orderStore.login.loginResponse = response;
        orderStore.settings.data.package = response.data.package;
        this.setState({ loading: false })
        this.props.navigation.push('Drawer');
      } else {
        this.setState({ loading: false })
        Toast.show(response.message);
      }
    }

  }

  onAppleButtonPress = async () => {
    // 1). start a apple sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });
    // 2). if the request was successful, extract the token and nonce
    const { identityToken, nonce,email,fullName } = appleAuthRequestResponse;
  
  
    // can be null in some scenarios
    if (identityToken) {
      // 3). create a Firebase `AppleAuthProvider` credential
      const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);
  
      // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
      //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
      //     to link the account to an existing user
      const userCredential = await  firebase.auth().signInWithCredential(appleCredential);
  
      // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
      console.log(`Firebase authenticated via Apple, UID: ${JSON.stringify(userCredential.user)}`);
     
      if(userCredential.user.email!=null){
        if(userCredential.user.displayName!=null)
        this.socialLogin(userCredential.user.email,userCredential.user.displayName,'apple@321')
        else
        this.socialLogin(userCredential.user.email,userCredential.user.email,'apple@321')

      }
      // console.log('EMAIL:',userCredential.user.email)
      // console.log('full:',userCredential.user.displayName)
      // console.log(`Firebase authenticated via Apple additional, UID: ${JSON.stringify(userCredential.additionalUserInfo)}`);
    } else {
      // handle this - retry?
    }
  }


  render() {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    return (
      <View style={styles.container}>
        <ImageBackground source={require('../../images/bk_ground.jpg')} style={styles.imgCon}>
          <ImageBackground source={require('../../images/Downtown_Shadownew.png')} style={styles.imgCon}>
            <View style={{ flex: 1 }}>
              <View style={{ height: height(5), width: width(100), flexDirection: 'row' }}>
                <TouchableOpacity style={styles.bckImgCon} onPress={() => this.props.navigation.goBack()}>
                  <Image source={require('../../images/back_btn.png')} style={styles.backBtn} />
                </TouchableOpacity>
                <View style={{ flex: 1, justifyContent: 'flex-end', marginHorizontal: 25 }}>
                  <Text style={styles.headerTxt}>{data.main_screen.sign_in}</Text>
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
                      placeholderTextColor='white'
                      textContentType='emailAddress'
                      keyboardType='email-address'
                      autoCapitalize={false}
                      underlineColorAndroid='transparent'
                      autoCorrect={true}
                      style={[styles.inputTxt ]}
                    />
                  </View>
                </View>
                <View style={styles.btn} onPress={() => { this.props.navigation.navigate('Login') }}>
                  <View style={{ marginHorizontal: 10 }}>
                    {/* <Image source={require('../../images/password.png')} style={styles.mail} /> */}
                    <IconLock name='lock' color='white' size={24} />
                  </View>
                  <View style={{ flex: 4.1 }}>
                    <TextInput
                      onChangeText={(value) => this.setState({ password: value })}
                      underlineColorAndroid='transparent'
                      placeholder={data.main_screen.password_placeholder}
                      secureTextEntry={this.state.pass_show == true ? false : true}
                      placeholderTextColor='white'
                      underlineColorAndroid='transparent'
                      // autoCorrect={true}
                      autoCapitalize='none'
                      style={styles.inputTxt}
                    />
                  </View>
                  <View style={{ marginHorizontal: 10 }} >
                    <Feather name= { this.state.pass_show == true ? 'eye-off' : 'eye'} color='white' size={22} onPress = {() => {this.setState({pass_show: !this.state.pass_show})}}/>
                  </View>
                </View>
                <TouchableOpacity style={[styles.signUpBtn, { backgroundColor: orderStore.settings.data.main_clr }]} onPress={() => this.login()}>
                  <Text style={styles.signUpTxt}>{data.main_screen.sign_in}</Text>
                </TouchableOpacity>
                <View style={styles.fgBtn}>
                  {
                    data.registerBtn_show.facebook ?
                      <TouchableOpacity style={{ width: width(37.2), height: height(5), borderRadius: 3, backgroundColor: 'transparent', backgroundColor: '#134A7C', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => { this.fbsdk() }}
                      >
                        <Text style={styles.socialBtnText}>{data.main_screen.fb_btn}</Text>
                      </TouchableOpacity>
                      :
                      null
                  }
                  {
                    data.registerBtn_show.google && data.registerBtn_show.facebook ?
                      <Text style={styles.orTxt}>{data.main_screen.separator}</Text>
                      :
                      null
                  }
                  {
                    data.registerBtn_show.google ?
                      <TouchableOpacity style={{ width: width(37), height: height(5), borderRadius: 3, backgroundColor: 'transparent', backgroundColor: '#DB4437', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => { this.handleGoogleSignIn() }}
                      >
                        <Text style={styles.socialBtnText}>{data.main_screen.g_btn}</Text>
                      </TouchableOpacity>
                      :
                      null
                  }

                </View>
                {
                Platform.OS == 'ios' && data.registerBtn_show.apple ?
              //   <AppleButton
              //   cornerRadius={5}
              //   style={{ width: width(42), height: height(5.5), marginTop: 5 }}
              //   buttonStyle={AppleButton.Style.BLACK}
              //   buttonType={AppleButton.Type.CONTINUE}
              //   onPress={() => this.onAppleButtonPress()}
              // />

              <TouchableOpacity
              onPress={() => this.onAppleButtonPress()}

                style={[{width: width(42), height: height(5.5), marginTop: 5,flexDirection:'row',borderRadius:wp(1)},{backgroundColor:"black"}]}>
                <View
                  style={[{
                    flex: .7,
                      heigh:wp(12),
                 
                    alignItems: "center",
                    justifyContent: "center",
                    paddingStart: wp(1),
                    paddingEnd: 5,
                    borderRadius:wp(1)
                  },{backgroundColor:'black'}]}
                >
                  <Image source={require('../../images/apple_logo_white.png')}
                    style={{ resizeMode: 'cover', width: 23, height: 23, }}

                  >
                  </Image>
                </View >
               

                <View
                  style={[{  
                 
                    height:wp(12),
                    justifyContent: 'center',},{backgroundColor:"black"}]}>
                  <Text style={[ { color:'white',marginStart: 5, alignSelf: 'flex-start' }]}>Sign in with Apple</Text>
                </View>
              </TouchableOpacity>
                  :
                  null
              }
                <View style={{ flex: 1, alignContent: 'center', justifyContent: 'center' }}>
                  {!this.state.loading ? null :
                    <ActivityIndicator size={INDICATOR_SIZE} color={store.settings.data.navbar_clr} animating={true} hidesWhenStopped={true} />}
                </View>
              </View>
              <View style={styles.footer}>
                <Text style={styles.forgetpwrd} onPress={() => this.props.navigation.navigate('ForgetPassword')}>{data.main_screen.forgot_text}</Text>
                <Text style={styles.newHere} onPress={() => this.props.navigation.navigate('SignUp')}>{data.main_screen.new_member}</Text>
                {/* <Text style={styles.signInT} onPress={() => this.props.navigation.navigate('SignUp')}>{data.main_screen.sign_up}</Text> */}
              </View>
            </View>
          </ImageBackground>
        </ImageBackground>
      </View>
    );
  }
}
