import React, { Component } from 'react';
import {
  Platform, ActivityIndicator, Text, View, Button, Image, ImageBackground, TouchableOpacity, I18nManager,
  TextInput,Linking
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import { INDICATOR_COLOR, INDICATOR_SIZE, OVERLAY_COLOR,COLOR_PRIMARY } from '../../../styles/common';
import { width, height, totalSize } from 'react-native-dimension';
import { observer } from 'mobx-react';
import Store from '../../Stores';
import store from '../../Stores/orderStore';
import styles from '../../../styles/SignUp'
import Icon from 'react-native-vector-icons/Octicons';
import IconLock from 'react-native-vector-icons/SimpleLineIcons';
import IconUser from 'react-native-vector-icons/FontAwesome';
import { GoogleSignin, GoogleSigninButton } from '@react-native-community/google-signin';
import Toast from 'react-native-simple-toast';
import ApiController from '../../ApiController/ApiController';
import LocalDB from '../../LocalDB/LocalDB'
import { LoginManager, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
// import { SignInWithAppleButton } from 'react-native-apple-authentication'
import Feather from 'react-native-vector-icons/Feather';
import { widthPercentageToDP as wp } from '../../helpers/Responsive'
import firebase from 'react-native-firebase';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
} from '@invertase/react-native-apple-authentication';


@observer export default class SignUp extends Component<Props> {
  constructor(props) {
    let { orderStore } = Store;
    let data = orderStore.settings.data;
    super(props);
    this.state = {
      loading: false,
      name: '',
      email: '',
      password: '',
      pass_show: false,
      term_checked : false,
    }
   
    I18nManager.forceRTL(true);
  }
  static navigationOptions = {
    header: null
  };
  componentWillMount() {
    GoogleSignin.configure({
      iosClientId: '191792720370-rc4ospf26req749phf3d4l4sfj74gmf4.apps.googleusercontent.com'
    })
  }

  componentDidMount() {
    /**
     * subscribe to credential updates.This returns a function which can be used to remove the event listener
     * when the component unmounts.
     */
    // if (Platform.OS == 'ios') {
    //   this.authCredentialListener = appleAuth.onCredentialRevoked(async () => {
    //     console.warn('Credential Revoked');
    //     this.fetchAndUpdateCredentialState().catch(error =>
    //       this.setState({ credentialStateForUser: `Error: ${error.code}` }),
    //     );
    //   });

    //   this.fetchAndUpdateCredentialState()
    //     .then(res => console.log('cre state for user ',res))
    //     .catch(error => this.setState({ credentialStateForUser: `Error: ${error.code}` }))
    // }

  }

  fetchAndUpdateCredentialState = async () => {
    if (this.user === null) {
      console.log('credentialStateForUser', credentialStateForUser)
      this.setState({ credentialStateForUser: 'N/A' });
    } else {

      const credentialState = await appleAuth.getCredentialStateForUser(this.user);
      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        console.log('credentialStateForUser', credentialState)

        this.setState({ credentialStateForUser: 'AUTHORIZED' });
      } else {
        console.log('credentialStateForUser', credentialState)

        this.setState({ credentialStateForUser: credentialState });
      }
    }
  }
  async handleAppleSignIn() {
    if(this.state.term_checked == false) return;
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: AppleAuthRequestOperation.LOGIN,
        requestedScopes: [
          AppleAuthRequestScope.EMAIL,
          AppleAuthRequestScope.FULL_NAME,
        ],
      });

      console.log('appleAuthRequestResponse', appleAuthRequestResponse);
      console.log('email', appleAuthRequestResponse.email)
      //authorization state request
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      console.log('credentialState', credentialState)
      console.log('credentialState', AppleAuthCredentialState.AUTHORIZED)

      if (credentialState === AppleAuthCredentialState.AUTHORIZED) {
        //user is authorized
      }


    } catch (error) {
      if (error.code === AppleAuthError.CANCELED) {
        console.warn('User canceled Apple Sign in.');
      } else {
        console.log(error);
      }
    }
  }


  // Google SignUp
  handleGoogleSignIn = () => {
    if(this.state.term_checked == false) return;
    GoogleSignin.signIn().then(func = async (user) => {
      //Calling local func for login through google
      store.LOGIN_SOCIAL_TYPE = 'social';
      store.LOGIN_TYPE = 'google';
      await this.socialSignUp(user.user.email, user.user.name, 'apple@321');
      console.log('Google login', user);
    }).catch((err) => {
      console.warn(err);
    }).done();
  }
  // FaceBook SignUp 
  fbLogin = async () => {
    if(this.state.term_checked == false) return;
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
      await this.socialSignUp(result.email, result.name, 'apple@321');
      // console.log('Success fetching data: ', result);
    }
  }
  //// Custom Social Login methode
  //// Custom Social Login methode
  socialSignUp = async (email, name, password) => {
    if(this.state.term_checked == false) return;
    if (this.state.email.length > 0 && this.state.password.length > 0) {
      var Email, Password;
      Email = this.state.email;
      Password = this.state.password;
    } else {
      Email = email;
      Password = password;
    }
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
      await LocalDB.saveProfile(Email, Password, response.data);

      let responseSetting = await ApiController.post('settings')

      orderStore.settings = responseSetting;
      if (orderStore.settings.success === true) {

        orderStore.statusbar_color = orderStore.settings.data.navbar_clr;
        orderStore.wpml_settings = orderStore.settings.data.wpml_settings

      }
      this.setState({ loading: false })
      orderStore.login.loginStatus = true;
      orderStore.login.loginResponse = response;
      // this.props.navigation.replace('Drawer')
      this.props.navigation.replace('SelectCity', {signup_flag : true})
    }else{
      this.setState({ loading: false })

    }
  }
  register = async () => {
    if(this.state.term_checked == false) return;
    this.setState({ loading: true })
    let params = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }
    let response = await ApiController.post('register', params)
    console.log('signup user =', response);
    if (response.success === true) {
      store.login.loginStatus = true;
      store.LOGIN_TYPE = 'local';
      await LocalDB.saveProfile(this.state.email, this.state.password, response.data);
      store.login.loginResponse = response;
      // await LocalDB.saveProfile(Email, Password, response.data);

      let responseSetting = await ApiController.post('settings')

      store.settings = responseSetting;
      if (store.settings.success === true) {

        store.statusbar_color = store.settings.data.navbar_clr;
        store.wpml_settings = store.settings.data.wpml_settings

      }
      
      // this.props.navigation.replace('Drawer');
      this.props.navigation.replace('SelectCity', {signup_flag : true})
    } else {
      this.setState({ loading: false })
      Toast.show(response.message, Toast.LONG);
    }
  }

  appleSignIn = (result) => {
    console.log('Resssult', result);
  };



    onAppleButtonPress  = async ()=> {
    // 1). start a apple sign-in request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [AppleAuthRequestScope.EMAIL, AppleAuthRequestScope.FULL_NAME],
    });
  
    // 2). if the request was successful, extract the token and nonce
    const { identityToken, nonce, email } = appleAuthRequestResponse;
    console.log('EMAIL:', email)
  
    // can be null in some scenarios
    if (identityToken) {
      // 3). create a Firebase `AppleAuthProvider` credential
      const appleCredential = firebase.auth.AppleAuthProvider.credential(identityToken, nonce);
  
      // 4). use the created `AppleAuthProvider` credential to start a Firebase auth request,
      //     in this example `signInWithCredential` is used, but you could also call `linkWithCredential`
      //     to link the account to an existing user
      const userCredential = await firebase.auth().signInWithCredential(appleCredential);
      if(userCredential.user.email!=null){
        if(userCredential.user.displayName!=null)
        this.socialSignUp(userCredential.user.email,userCredential.user.displayName,'apple@321')
        else
        this.socialSignUp(userCredential.user.email,userCredential.user.email,'apple@321')
      }
      // user is now signed in, any Firebase `onAuthStateChanged` listeners you have will trigger
      // console.log(`Firebase authenticated via Apple, UID: ${JSON.stringify(userCredential.user)}`);
      
      // console.log(`Firebase authenticated via Apple additional, UID: ${JSON.stringify(userCredential.additionalUserInfo)}`);
    } else {
      // handle this - retry?
    }
  }
    // 2020-0612 added shendi
    _goToURL() {
      const terms_url = 'https://findex.com.co/privacy-policy-2'; // Terms and Service
      Linking.openURL(terms_url);
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
              <View style={{ flex: 0.5, justifyContent: 'flex-end', marginHorizontal: 25 }}>
                <Text style={styles.headerTxt}>{data.main_screen.sign_up}</Text>
              </View>
            </View>
            <View style={styles.logoView}>
              <Image source={{ uri: data.logo }} style={styles.logoImg} />
              <Text style={styles.logoTxt}>{data.slogan}</Text>
            </View>
            <View style={styles.buttonView}>
              <View style = {styles.terms_line}>
                  <CheckBox  checked={this.state.term_checked} onPress = {() => {
                      if(this.state.loading == false)
                      {
                        this.setState({term_checked: !this.state.term_checked})}
                      }} 
                    checkedColor = {COLOR_PRIMARY} activeOpacity={1} textStyle = {styles.terms_checkbox_txt}
                     containerStyle={styles.terms_checkbox} title='You must accept'/>
                  <Text style={styles.terms_txt} onPress = {this._goToURL}>Terms and conditions</Text>
              </View>
              <View style={styles.btn} onPress={() => { this.props.navigation.navigate('Login') }}>
                <View style={{ marginHorizontal: 10 }}>
                  {/* <Image source={require('../../images/user.png')} style={styles.userImg} /> */}
                  <IconUser name='user-o' color='white' size={24} />
                </View>
                <View style={{ flex: 4.1 }}>
                  <TextInput
                    onChangeText={(value) => this.setState({ name: value })}
                    underlineColorAndroid='transparent'
                    placeholder={data.main_screen.name_placeholder}
                    placeholderTextColor='white'
                    underlineColorAndroid='transparent'
                    autoCorrect={true}
                    autoFocus={false}
                    keyboardAppearance='default'
                    keyboardType='default'
                    style={[styles.inputTxt, { textAlign: I18nManager.isRTL ? 'right' : 'left' }]}
                  />
                </View>
              </View>
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
                    keyboardType='email-address'
                    underlineColorAndroid='transparent'
                    autoCorrect={true}
                    style={[styles.inputTxt, { textAlign: I18nManager.isRTL ? 'right' : 'left' }]}
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
                    autoCorrect={false}
                    style={[styles.inputTxt, { textAlign: I18nManager.isRTL ? 'right' : 'left' }]}
                  />
                </View>
                <View style={{ marginHorizontal: 10 }} >
                  <Feather name= { this.state.pass_show == true ? 'eye-off' : 'eye'} color='white' size={22} onPress = {() => {this.setState({pass_show: !this.state.pass_show})}}/>
                </View>
              </View>
              <TouchableOpacity style={[styles.signUpBtn, { backgroundColor: orderStore.settings.data.main_clr }]} onPress={() => this.register()} >
                <Text style={styles.signUpTxt}>{data.main_screen.sign_up}</Text>
              </TouchableOpacity>
              <View style={styles.fgBtn}>
                {
                  data.registerBtn_show.facebook ?
                    <TouchableOpacity style={styles.buttonCon}
                      onPress={() => { this.fbLogin() }} >
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
                    <TouchableOpacity style={[styles.buttonCon, { backgroundColor: '#DB4437' }]}
                      onPress={() => { this.handleGoogleSignIn() }} >
                      <Text style={styles.socialBtnText}>{data.main_screen.g_btn}</Text>
                    </TouchableOpacity>
                    :
                    null
                }


              </View>
              {/* {
                  data.registerBtn_show.apple ?
                  <Text>Or</Text>:null
              } */}
             
              {
                Platform.OS == 'ios' && data.registerBtn_show.apple ?
                  // <AppleButton
                  //   cornerRadius={5}
                  //   style={{ width: width(42), height: height(5.5), marginTop: 5 }}
                  //   buttonStyle={AppleButton.Style.BLACK}
                  //   buttonType={AppleButton.Type.CONTINUE}
                  //   onPress={() =>this.onAppleButtonPress()}
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


              
                {!this.state.loading ? null :
              <View style={{ flex: 1,marginTop:5, alignContent: 'center', justifyContent: 'center',alignSelf:'center' }}>
                {/* {!this.state.loading ? null : */}
                  <ActivityIndicator size={INDICATOR_SIZE} color={store.settings.data.navbar_clr} animating={true} hidesWhenStopped={true} />
              </View>
                }
              {/* <View style={{marginTop:wp('2')}}>
                {SignInWithAppleButton(styles.appleBtn, this.appleSignIn)}
              </View> */}

              {/* <View style={styles.fgBtn}>
               

              </View> */}

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
